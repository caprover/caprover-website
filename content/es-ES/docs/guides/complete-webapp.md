---
id: complete-webapp
title: Tutorial de aplicación web completa
slug: /guides/complete-webapp
---

- Este ejemplo combina una aplicación web Node.js pública, un worker privado, PostgreSQL y un directorio persistente para archivos subidos.
- La aplicación web recibe un trabajo y el worker lo marca como procesado en PostgreSQL.
- **Los endpoints no tienen autenticación y este ejemplo es solo para un entorno de pruebas descartable.** Utiliza un servidor de un único nodo con suficiente memoria para PostgreSQL y dos servicios Node.js; 1 GB de RAM puede ser insuficiente para compilar varias imágenes a la vez.

## 1. Crear la base de datos privada

- Completa [Primeros pasos](../get-started.md), incluidos el DNS wildcard y el HTTPS del dashboard.
- Crea una aplicación CapRover llamada `demo-db`, con **Has Persistent Data** activado y **Do not expose as web app** seleccionado.
- Añade un volumen con nombre `demo-db-data` montado en `/var/lib/postgresql/data`, que es la ruta de datos de la imagen PostgreSQL 17.
- Configura estas variables de entorno antes del primer despliegue:

| Variable | Valor |
| --- | --- |
| `POSTGRES_USER` | `demo` |
| `POSTGRES_DB` | `demo` |
| `POSTGRES_PASSWORD` | Una contraseña única y segura guardada en un lugar protegido |

En la pestaña **Deployment**, despliega esta Captain Definition que utiliza una imagen ya construida:

```json
{"schemaVersion":2,"imageName":"postgres:17-alpine"}
```

- Espera a que el servicio esté ejecutándose y sus logs indiquen que acepta conexiones.
- Mantén privado el puerto `5432` de la base de datos. No necesitas publicarlo en el host.
- Cambiar `POSTGRES_PASSWORD` después de inicializar el volumen no cambia la contraseña del usuario existente en PostgreSQL.

## 2. Compilar las imágenes web y worker

En un directorio local nuevo, crea `package.json`:

```json
{"name":"caprover-multi-service-demo","version":"1.0.0","private":true,"type":"module","dependencies":{"pg":"8.11.5"}}
```

Crea `web.mjs`. Utiliza las variables de entorno estándar de PostgreSQL, inserta trabajos en la base de datos y guarda un archivo de ejemplo en el directorio montado:

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

Crea `worker.mjs` para procesar los trabajos de la misma base de datos:

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

Crea estos dos Dockerfiles:

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

Crea dos archivos Captain Definition en el mismo directorio:

```json title="captain-definition-web"
{"schemaVersion":2,"dockerfilePath":"./Dockerfile.web"}
```

```json title="captain-definition-worker"
{"schemaVersion":2,"dockerfilePath":"./Dockerfile.worker"}
```

Ejecuta `npm install --package-lock-only` localmente para generar `package-lock.json` y empaqueta los archivos. El build utiliza `npm ci`, así que incluye el lockfile en el tar:

```bash
npm install --package-lock-only
tar -cf deploy.tar package.json package-lock.json web.mjs worker.mjs \
  Dockerfile.web Dockerfile.worker captain-definition-web captain-definition-worker
```

## 3. Crear, configurar y desplegar las demás aplicaciones

- Crea `demo-web` y activa **Has Persistent Data**.
- Añade un volumen `demo-uploads` montado en `/data/uploads`, configura el puerto HTTP del contenedor en `3000` y añade las variables de conexión a la base de datos que aparecen a continuación.
- Crea `demo-worker` como aplicación no web, sin volumen, con las mismas variables:

| Variable | Valor en ambas aplicaciones |
| --- | --- |
| `PGHOST` | `demo-db` |
| `PGPORT` | `5432` |
| `PGUSER` | `demo` |
| `PGDATABASE` | `demo` |
| `PGPASSWORD` | La misma contraseña configurada para `demo-db` |

- Las aplicaciones nuevas usan su nombre como nombre interno del servicio Docker; en aplicaciones antiguas, comprueba el nombre real con `docker service ls`.
- En la pestaña **Deployment** de `demo-web`, establece Captain Definition Path en `./captain-definition-web` y sube `deploy.tar`.
- Cuando la aplicación web arranque y cree la tabla `jobs`, establece Captain Definition Path de `demo-worker` en `./captain-definition-worker` y sube el mismo archivo.
- Revisa los logs del build y de los servicios de ambas aplicaciones.
- El worker no necesita dominio público ni mapeo de puertos.

Visita `http://demo-web.<root-domain>/jobs`. Deberías recibir `[]`. Después activa HTTPS para `demo-web`, verifica el certificado y ejecuta las siguientes peticiones sustituyendo el hostname de ejemplo:

```bash
curl -X POST --data 'first job' https://demo-web.apps.example.com/jobs
curl https://demo-web.apps.example.com/jobs
curl -X PUT --data 'saved upload' https://demo-web.apps.example.com/upload
curl https://demo-web.apps.example.com/upload
```

- Actualiza `/jobs` después de unos segundos y comprueba que el trabajo muestra `processed: true`.
- El archivo subido debe devolver `saved upload`.
- Redespliega `demo-web` y comprueba que el archivo sigue existiendo. Reinicia `demo-db` y verifica que el trabajo continúa en la base de datos.
- Si desaparece alguno, revisa la ruta montada y el nodo donde se ejecuta el servicio.

## 4. Hacer backup de cada fuente de datos

- El [backup de configuración](../server/backup/index.md) de CapRover no incluye `demo-db-data` ni `demo-uploads`.
- Configura un backup lógico de PostgreSQL y una copia independiente del volumen de archivos subidos. Guarda ambos fuera del servidor y prueba restaurarlos.
- Consulta [Backup de datos persistentes](../data-persistence/backup-data.md).
- Este tutorial mantiene las dos aplicaciones stateful en el mismo nodo. Los [volúmenes locales no se mueven con las tareas de Swarm](../data-persistence/index.md).
- Una aplicación de producción también necesita autenticación, políticas de upload, reparto seguro de trabajos entre varios workers y una estrategia de despliegue y migración del esquema de base de datos.

<span id="source-guides-sample-apps"></span>

## Aplicaciones de ejemplo

Las [aplicaciones de ejemplo de CapRover](https://github.com/caprover/caprover/tree/master/captain-sample-apps) muestran Dockerfiles y Captain Definitions para distintos frameworks.

1. Elige un ejemplo y revisa su `captain-definition`, Dockerfile, puerto HTTP del contenedor y variables de entorno necesarias.
2. Crea una aplicación descartable desde el dashboard.
3. Elige cómo desplegar: empaqueta los archivos en un tar y súbelo desde **Deployment**, **o** haz commit del ejemplo en una rama Git y despliega mediante la [CLI](../deployments/cli.md). El modo Git de la CLI excluye archivos sin commit o ignorados.
4. Revisa los logs del build. Si el contenedor escucha en otro puerto, actualiza el puerto HTTP de la aplicación. Comprueba la URL mediante HTTP y después HTTPS.

Las credenciales y datos del ejemplo son solo ilustrativos. Antes de usarlo en producción, configura secretos reales, persistencia y [backups](../server/backup/index.md).

Otros ejemplos de frameworks aportados por la comunidad en la documentación anterior:

- [Ejemplo CapRover para Django](https://gitlab.com/kamneros/caprover-django)
- [Plantilla Laravel para CapRover](https://github.com/jackbrycesmith/laravel-caprover-template)
- [Ejemplo Elixir/Phoenix](https://github.com/TehSnappy/phoenix_sample)

Estos ejemplos de terceros pueden no estar mantenidos. Revisa versiones de imágenes y dependencias antes de desplegarlos.

<span id="source-guides-recipes"></span>

## Recetas adicionales

Guías concretas para tareas habituales:

- [Desplegar una imagen Docker existente](../deployments/index.md) y configurar su puerto HTTP y URL pública.
- [Conectar dos aplicaciones mediante la red privada](../domains/firewall.md) sin publicar puertos de base de datos.
- [Asignar un dominio personalizado](../domains/index.md) y activar [HTTPS](../domains/index.md).
- [Añadir un directorio persistente](../data-persistence/index.md) antes de escribir archivos.
- [Escalar una aplicación](../scaling/index.md) después de revisar sesiones y almacenamiento.
- [Exportar y restaurar la configuración del servidor](../server/backup/index.md) junto con un [backup de los datos](../data-persistence/backup-data.md).

Para ejemplos completos, consulta [Aplicación web completa](complete-webapp.md) y [Aplicación estática / React](static-react.md).
