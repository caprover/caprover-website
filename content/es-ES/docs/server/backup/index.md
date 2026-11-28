---
id: index
title: Backup y restauración de CapRover
slug: /server/backup
---

<span id="source-server-backup-contents"></span>

## Qué incluye un backup

Un backup de CapRover copia **`/captain/data`** y añade metadatos sobre los nodos del clúster. Incluye el estado y la configuración de CapRover, como las definiciones de aplicaciones, dominios y certificados almacenados en ese directorio.

- **No** incluye automáticamente volúmenes Docker, bind mounts externos a ese directorio, datos de bases de datos o archivos subidos allí, ni imágenes Docker compiladas localmente.
- Haz backups independientes de cada base de datos mediante dumps o snapshots consistentes, y copia los directorios persistentes que utilicen tus aplicaciones.
- Comprueba mediante una restauración que puedes recuperar tanto el archivo de CapRover como los datos de las aplicaciones.

- Hay una excepción respecto a las imágenes: los datos de un **registry autohospedado** están en `/captain/data/registry`. Ese directorio se copia y puede aumentar mucho el tamaño del backup.
- Si utilizas un registry externo, asegúrate de conservar las credenciales y de que su política de retención permita restaurar las imágenes necesarias.
- Si las imágenes ya no están disponibles, tendrás que volver a desplegar las aplicaciones después de restaurar sus definiciones.

Consulta [Crear un backup](index.md), [Restaurar un servidor](restore.md) y [Directorios persistentes](../../data-persistence/index.md).

<span id="source-server-backup-create"></span>

## Crear un backup

1. En el dashboard, abre **Maintenance → Configuration Backup** y haz clic en **Create Backup**. En versiones anteriores del dashboard, busca esta opción en **Settings**.
2. Descarga el archivo `.tar`, comprueba que no esté vacío y guárdalo fuera del servidor con permisos de acceso restringidos.
3. Haz backups separados de bases de datos y directorios persistentes; [el backup de CapRover tiene un alcance limitado](index.md).
4. Restaura periódicamente ambos tipos de backup en un servidor de prueba y verifica las aplicaciones.

- El archivo se genera en el servidor y se ofrece mediante una descarga temporal.
- Guarda tu propia copia: el enlace de descarga generado caduca.
- Si utilizas un registry autohospedado, reserva espacio suficiente para sus imágenes dentro del backup.

<span id="source-server-backup-automate"></span>

## Automatizar backups

- La acción **Create Backup** del dashboard dispone de un endpoint autenticado en la API.
- El siguiente ejemplo requiere `curl` y `jq`.
- Configura `CAPROVER_URL` con la URL HTTPS del dashboard y proporciona `CAPROVER_PASSWORD` de forma segura mediante el gestor de secretos de tu scheduler.

```bash
set -euo pipefail
umask 077
api_token=$(curl --fail --silent --show-error "$CAPROVER_URL/api/v2/login" \
  -H 'x-namespace: captain' -H 'content-type: application/json' \
  --data "$(jq -n --arg password "$CAPROVER_PASSWORD" '{password:$password}')" | jq -er '.data.token')
download_token=$(curl --fail --silent --show-error "$CAPROVER_URL/api/v2/user/system/createbackup" \
  -H "x-captain-auth: $api_token" -H 'x-namespace: captain' \
  --data '{"postDownloadFileName":"backup.tar"}' | jq -er '.data.downloadToken')
curl --fail --silent --show-error -G "$CAPROVER_URL/api/v2/downloads/" \
  --data-urlencode 'namespace=captain' --data-urlencode "downloadToken=$download_token" \
  -o backup.tar
test -s backup.tar
```

- Mueve el archivo a almacenamiento externo con fecha, cifra su contenido cuando corresponda y configura retención y alertas de fallos.
- El token de descarga es temporal: termina la descarga en la misma ejecución.
- Programa backups independientes para las bases de datos y los volúmenes, y prueba la restauración periódicamente.

<span id="source-reference-backup-contents"></span>

## Contenido del backup

La [implementación del backup](https://github.com/caprover/caprover/blob/master/src/user/system/BackupManager.ts) archiva `/captain/data` y añade `meta/backup.json` con el salt de CapRover y metadatos de los nodos del clúster.

| Incluido | Excluido salvo que esté dentro de `/captain/data` |
| --- | --- |
| Configuración guardada de CapRover, definiciones de aplicaciones, certificados y datos del registry autohospedado en `/captain/data/registry`. | Volúmenes Docker y bind mounts de otras rutas, archivos de bases de datos en esas ubicaciones y almacenamiento local de imágenes Docker. |

- El registry autohospedado puede hacer que el archivo sea muy grande.
- Durante la instalación inicial, el código de restauración busca `/captain/backup.tar` y extrae su contenido en `/captain/restoring`.
- Consulta [Qué incluye un backup](index.md) y [Restaurar un servidor](restore.md) para ver todos los pasos de recuperación.
