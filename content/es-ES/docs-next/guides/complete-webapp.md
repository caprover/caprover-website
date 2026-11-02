---
id: complete-webapp
title: Tutorial de aplicación web completa
slug: /guides/complete-webapp
---

- Este ejemplo combina una aplicación web pública Node, un worker privado, PostgreSQL y un directorio de carga persistente.
- La aplicación web acepta un pequeño trabajo; el worker lo marca procesado en PostgreSQL.
- **Los puntos finales no tienen autenticación y son para un entorno de aprendizaje desechable.** Utilice un servidor de un solo nodo con suficiente memoria para los servicios de PostgreSQL y dos Nodos; un host de 1 GB puede ser demasiado pequeño para construir imágenes simultáneas.

## 1. Crear la base de datos privada

- Completa [Comienzo](../get-started.md), incluyendo DNS de comodín y HTTPS de dashboard.
- Crear una aplicación CapRover `demo-db` con **Tiene datos persistentes** habilitados y habilitados **No exponer como aplicación web** seleccionada.
- Añadir un volumen llamado `demo-db-data` a `/var/lib/postgresql/data`, la ruta de datos para la imagen PostgreSQL 17.
- Establecer estas variables de entorno de aplicación antes del primer despliegue:

| Variable | Valor |
| --- | --- |
| `POSTGRES_USER` | `demo` |
| `POSTGRES_DB` | `demo` |
| `POSTGRES_PASSWORD` | Una contraseña segura única |

En el **Despliegue** tab, desplegar esta imagen solamente Captain Definition:

```json
{"schemaVersion":2,"imageName":"postgres:17-alpine"}
```

- Espere hasta que su servicio esté funcionando y sus registros dicen que está listo para las conexiones.
- Mantenga el puerto de base `5432` privado; no hay necesidad de publicar un puerto host.
- Cambio `POSTGRES_PASSWORD` después de la inicialización del volumen no cambia la contraseña del usuario de la base de datos existente.

## 2. Construir la web y las imágenes de workers

En un nuevo directorio local, crear `package.json`:

```json
{"name":"caprover-multi-service-demo","version":"1.0.0","private":true,"type":"module","dependencies":{"pg":"8.11.5"}}
```

Crear `web.mjs`. Utiliza las variables estándar del entorno PostgreSQL, escribe un trabajo a la base de datos y almacena una pequeña carga en la ruta montada:

```javascript
import http from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import pg from 'pg';

const pool = new pg.Pool();
pool.on('error', (error) => console.error('Database connection error:', error));
const upload = '/data/uploads/note.txt';
await mkdir('/data/uploads', { recursive: true });
await pool.query(`CREATE TABLE IF NOT EXISTS jobs (
  id BIGSERIAL PRIMARY KEY, label TEXT NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE
)`);

async function readSmallBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 4096) throw new Error('Body exceeds 4 KB');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

http.createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/jobs') {
      const label = (await readSmallBody(req)).trim();
      if (!label) { res.writeHead(400).end('Empty job'); return; }
      const result = await pool.query(
        'INSERT INTO jobs (label) VALUES ($1) RETURNING id', [label]);
      res.writeHead(201, { 'content-type': 'application/json' });
      res.end(JSON.stringify(result.rows[0]));
    } else if (req.method === 'GET' && req.url === '/jobs') {
      const result = await pool.query('SELECT * FROM jobs ORDER BY id DESC LIMIT 10');
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(result.rows));
    } else if (req.method === 'PUT' && req.url === '/upload') {
      await writeFile(upload, await readSmallBody(req));
      res.writeHead(204).end();
    } else if (req.method === 'GET' && req.url === '/upload') {
      const value = await readFile(upload, 'utf8').catch((error) => {
        if (error.code === 'ENOENT') return '';
        throw error;
      });
      res.writeHead(200, { 'content-type': 'text/plain' }).end(value);
    } else {
      res.writeHead(404).end();
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500).end();
  }
}).listen(3000, '0.0.0.0');
```

Crear `worker.mjs` para procesar los trabajos de la misma base de datos:

```javascript
import pg from 'pg';

const pool = new pg.Pool();
pool.on('error', (error) => console.error('Database connection error:', error));
async function processJobs() {
  try {
    const result = await pool.query(
      'UPDATE jobs SET processed = TRUE WHERE processed = FALSE RETURNING id');
    if (result.rowCount) console.log(`Processed ${result.rowCount} jobs`);
  } catch (error) {
    console.error('Worker will retry:', error);
  }
}

async function poll() {
  await processJobs();
  setTimeout(poll, 2000);
}
await poll();
```

Cree estos dos Dockerfiles:

```dockerfile title="Dockerfile.web"
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY web.mjs ./
CMD ["node", "web.mjs"]
```

```dockerfile title="Dockerfile.worker"
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY worker.mjs ./
CMD ["node", "worker.mjs"]
```

Crear dos archivos de Captain Definition en el mismo directorio:

```json title="captain-definition-web"
{"schemaVersion":2,"dockerfilePath":"./Dockerfile.web"}
```

```json title="captain-definition-worker"
{"schemaVersion":2,"dockerfilePath":"./Dockerfile.worker"}
```

Corre `npm install --package-lock-only` localmente para crear `package-lock.json`, luego empaquetar los archivos. Usos de la build `npm ci`, por lo que incluye el archivo de bloqueo en el archivo:

```bash
npm install --package-lock-only
tar -cf deploy.tar package.json package-lock.json web.mjs worker.mjs \
  Dockerfile.web Dockerfile.worker captain-definition-web captain-definition-worker
```

## 3. Crear, configurar y desplegar las demás aplicaciones

- Crear `demo-web` con **Tiene datos persistentes** habilitado.
- Añadir un volumen llamado `demo-uploads` a `/data/uploads`, establecer el puerto HTTP contenedor `3000`, y darle las variables de base de datos a continuación.
- Crear `demo-worker` como aplicación no USB sin volumen y las mismas variables de base:

| Variable | Valor en ambas aplicaciones |
| --- | --- |
| `PGHOST` | `demo-db` |
| `PGPORT` | `5432` |
| `PGUSER` | `demo` |
| `PGDATABASE` | `demo` |
| `PGPASSWORD` | La misma contraseña `demo-db` |

- Las nuevas aplicaciones CapRover usan su nombre de aplicación como el nombre de servicio Docker interno; confirma el nombre real con `docker service ls` si estás usando una aplicación heredada.
- En `demo-web`'s **Despliegue** pestaña, establecer el camino de Captain Definition `./captain-definition-web` y subir `deploy.tar`.
- Después de la aplicación web comienza y crea `jobs` cuadro, conjunto `demo-worker`Es el camino de Captain Definition `./captain-definition-worker` y subir el mismo archivo allí.
- Inspeccione los registros de build y servicio para ambas aplicaciones.
- El worker no necesita dominio público ni cartografía portuaria.

Visita `http://demo-web.<root-domain>/jobs` y esperar `[]`. A continuación, active HTTPS para `demo-web`, verificar su certificado, y hacer estas solicitudes, reemplazando el nombre de host ejemplo:

```bash
curl -X POST --data 'first job' https://demo-web.apps.example.com/jobs
curl https://demo-web.apps.example.com/jobs
curl -X PUT --data 'saved upload' https://demo-web.apps.example.com/upload
curl https://demo-web.apps.example.com/upload
```

- Refresh `/jobs` después de unos segundos y comprobar que el trabajo tiene `processed: true`.
- La carga debe decir `saved upload`.
- Redistribución `demo-web` y verificar los restos de carga; reiniciar `demo-db` y confirmar el trabajo sigue en la lista.
- Si uno desaparece, inspeccione la ruta de montaje configurada y el nodo que alberga ese servicio.

## 4. Hacer copia de seguridad de cada origen de datos

- CapRover [configuración copia de seguridad](../server/backup/index.md) no contiene `demo-db-data` o `demo-uploads`.
- Configurar una copia de seguridad lógica PostgreSQL y una copia separada del volumen de carga, almacenar ambos fuera del host y la restauración de pruebas.
- Consulta [Volver arriba Datos persistentes](../data-persistence/backup-data.md).
- Este tutorial mantiene ambas aplicaciones de estado en un solo nodo; [los volúmenes locales no se mueven con una tarea de Swarm](../data-persistence/index.md).
- Una aplicación de producción también necesita autenticación, una política de carga, empleo que reclama para múltiples workers, y una estrategia de despliegue y migración de bases de datos.

<span id="source-guides-sample-apps"></span>

## Aplicaciones de muestra

El [Aplicaciones de ejemplo de CapRover](https://github.com/caprover/caprover/tree/master/captain-sample-apps) Demostrar Dockerfiles y definiciones de Capitán para varios marcos.

1. Escoge una muestra e inspecciona su `captain-definition`, Dockerfile, puerto de contenedores expuestos y variables ambientales requeridas.
2. Cree una aplicación desechable en el panel.
3. Elija un método de despliegue: empaque los archivos de despliegue de la muestra en un archivo de tar y suba desde la aplicación **Despliegue** tab, **o** comprometer la muestra a una rama de Git y desplegarla con la [CLI](../deployments/cli.md)El modo Git normal del CLI excluye archivos no comprometidos e ignorados.
4. Mira registros de build. Si el contenedor escucha en un puerto distinto al predeterminado de CapRover, establece el puerto HTTP contenedor de la aplicación en consecuencia. Compruebe la URL de la aplicación sobre HTTP y luego HTTPS.

Protege las credenciales de muestra y datos de muestra como ejemplos solamente. Antes de utilizar la producción, establecer secretos reales, añadir persistencia cuando sea necesario, y planificar [backups](../server/backup/index.md).

Ejemplos adicionales del marco comunitario de la documentación heredada:

- [CapRover Django ejemplo](https://gitlab.com/kamneros/caprover-django)
- [Laravel CapRover plantilla](https://github.com/jackbrycesmith/laravel-caprover-template)
- [Muestra de Elixir/Phoenix](https://github.com/TehSnappy/phoenix_sample)

Estos ejemplos de terceros pueden no mantenerse. Revise sus versiones de imagen y dependencias antes de desplegarse.

<span id="source-guides-recipes"></span>

## Recetas adicionales

Utilice estas recetas enfocadas para tareas comunes de seguimiento:

- [Implementar una imagen Docker existente](../deployments/index.md), luego establecer el puerto HTTP contenedor y verificar la URL pública.
- [Conectar dos aplicaciones en privado](../domains/firewall.md) sin publicar un puerto de base de datos.
- [Adjuntar un dominio personalizado](../domains/index.md) y habilitación [HTTPS](../domains/index.md).
- [Agregar un directorio persistente](../data-persistence/index.md) antes de escribir archivos.
- [Escalar una aplicación](../scaling/index.md) después de comprobar la sesión y el comportamiento de almacenamiento.
- [Exportar y restaurar la configuración del servidor](../server/backup/index.md) junto con un separado [respaldo de datos](../data-persistence/backup-data.md).

Para ejemplos completos, véase [Aplicación web completa](complete-webapp.md) y [Aplicación Static / React](static-react.md).
