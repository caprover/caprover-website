---
id: cli
title: Comandos CLI
slug: /reference/cli
---

Instala la [CLI de CapRover](https://github.com/caprover/caprover-cli) en tu equipo:

```bash
npm install -g caprover
```

| Comando | Función |
| --- | --- |
| `caprover serversetup` | Inicializar servidor y dominio raíz |
| `caprover login` | Guardar un inicio de sesión |
| `caprover list` | Listar servidores guardados |
| `caprover deploy` | Desplegar rama, archivo o imagen |
| `caprover logout` | Cerrar una sesión guardada |
| `caprover api` | Invocar la API |

## Opciones de despliegue

**Origen (elige uno):**

- `-b, --branch`: rama Git commiteada.
- `-t, --tarFile`: archivo local, incluidos archivos generados.
- `-i, --imageName`: imagen Docker existente.

**Destino y autenticación:**

- `-u, --caproverUrl`: URL del servidor.
- `-a, --caproverApp`: nombre de la aplicación.
- `--appToken` o `CAPROVER_APP_TOKEN`: token de despliegue limitado a la aplicación.
- `-d, --default`: reutilizar los valores guardados.

Otras opciones: `-n, --caproverName`, `-p, --caproverPassword` y `-c, --configFile`.

**Ejemplo: desplegar un archivo**

```bash
caprover deploy -u https://captain.apps.example.com -a my-app \
  --appToken "$CAPROVER_APP_TOKEN" -t ./deploy.tar
```

- Los despliegues desde Git excluyen archivos sin commit o ignorados.
- Consulta `caprover deploy --help` en tu versión instalada.
- Protege las credenciales y evita incluirlas en el repositorio.
- Consulta [Despliegue con CLI](../deployments/cli.md) para ver el procedimiento completo.
