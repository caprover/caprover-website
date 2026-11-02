---
id: cli
title: Comandos CLI
slug: /reference/cli
---

Instalar el [CapRover CLI](https://github.com/caprover/caprover-cli) en su computadora:

```bash
npm install -g caprover
```

| Comando | Propósito |
| --- | --- |
| `caprover serversetup` | Iniciar servidor y dominio raíz |
| `caprover login` | Guardar un servidor |
| `caprover list` | Lista de servidores guardados |
| `caprover deploy` | Implementar una rama, archivo o imagen |
| `caprover logout` | Eliminar un login guardado |
| `caprover api` | Llame a la API |

## Opciones de despliegue

**Fuente:**

- `-b, --branch`: rama de Git Cometida
- `-t, --tarFile`: Archivo local, incluyendo archivos generados
- `-i, --imageName`: Imagen de Docker existente

**Destino y autenticación:**

- `-u, --caproverUrl`: URL del servidor
- `-a, --caproverApp`: Nombre de la aplicación
- `--appToken` o `CAPROVER_APP_TOKEN`: Token de despliegue de la aplicación
- `-d, --default`: Reutilizar opciones ahorradas

Opciones adicionales: `-n, --caproverName`, `-p, --caproverPassword`, y `-c, --configFile`.

**Ejemplo: Implementar un archivo**

```bash
caprover deploy -u https://captain.apps.example.com -a my-app \
  --appToken "$CAPROVER_APP_TOKEN" -t ./deploy.tar
```

- Las implementaciones de la rama de Git excluyen archivos no comprometidos e ignorados.
- Check `caprover deploy --help` para su versión instalada.
- Protege las credenciales del servidor y mantenlas fuera de los archivos comprometidos.
- See [CLI Deployment](../deployments/cli.md) para el paseo.
