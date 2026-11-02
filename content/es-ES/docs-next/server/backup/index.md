---
id: index
title: Backup &amp; Restore CapRover
slug: /server/backup
---

<span id="source-server-backup-contents"></span>

## Lo que está respaldado

Una copia de seguridad de CapRover **`/captain/data`** y añade metadatos sobre los nodos de racimo. Esto incluye configuración y estado de CapRover, tales como definiciones de aplicaciones, configuraciones de dominio y certificados almacenados allí.

- Lo hace **no** automáticamente incluyen volúmenes Docker, monturas de host bind fuera de ese directorio, contenidos de bases de datos almacenados en esos lugares, archivos subidos allí, o imágenes Docker construidas localmente.
- Realiza una copia de seguridad de cada base de datos usando su propio proceso de exportación o instantánea consistente, y copiar los directorios persistentes que realmente utiliza.
- Prueba que tanto el archivo CapRover como los datos de aplicación pueden ser restaurados.

- Una excepción a la regla de la imagen es una **registry autohospedado**: sus datos de imagen almacenados `/captain/data/registry`, por lo que ese directorio es copiado y puede aumentar enormemente el tamaño de archivo.
- Con un registro externo, mantenga sus credenciales y su política de retención de imágenes disponibles para su restauración.
- Sin imágenes accesibles, redespliegue aplicaciones después de restaurar sus definiciones.

Consulta [Crear un respaldo](index.md), [Restaurar un servidor](restore.md), y [Persistent Directories](../../data-persistence/index.md).

<span id="source-server-backup-create"></span>

## Crear un respaldo

1. En el panel CapRover, vaya a **Ajustes** y seleccionar **Crear respaldo**.
2. Descargar el resultado `.tar` archivo, verifique que no es vacío, y almacenarlo fuera del servidor con controles de acceso.
3. Respaldar las bases de datos de aplicaciones y los directorios persistentes por separado; [el archivo CapRover tiene alcance limitado](index.md).
4. Restaurar periódicamente ambos tipos de respaldo a un servidor de prueba y verificar las aplicaciones.

- El archivo se genera en el servidor, luego se ofrece como una descarga temporal.
- Mantenga su propia copia: la descarga generada es temporal.
- Si se habilita un registry autohospedado, permita espacio para sus datos de imagen en el archivo.

<span id="source-server-backup-automate"></span>

## Automate Backups

- El salpicadero **Crear respaldo** acción tiene un punto final de API autenticado correspondiente.
- Necesidades del siguiente ejemplo `curl` y `jq`.
- Establece `CAPROVER_URL` a su origen de panel HTTPS y proporcionar `CAPROVER_PASSWORD` a través de la tienda secreta de su agenda.

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

- Mueva el archivo a datar almacenamiento fuera del servicio, encriptarlo según corresponda, y establezca alertas de retención y fracaso.
- El token de descarga es temporal; termine la descarga en la misma carrera.
- Programar bases de datos y copias de seguridad de volumen separadas y la restauración de pruebas regularmente.

<span id="source-reference-backup-contents"></span>

## Contenidos de respaldo

El [Aplicación de las medidas de apoyo](https://github.com/caprover/caprover/blob/master/src/user/system/BackupManager.ts) archivos `/captain/data` y adiciones `meta/backup.json` con la sal de CapRover y metadatos de nodos de racimo.

| Incluido | Excluido a menos que se almacene dentro `/captain/data` |
| --- | --- |
| Configuración guardada de CapRover, definiciones de aplicaciones, certificados y datos de registry autohospedados bajo `/captain/data/registry`. | Docker volúmenes y host bind montajes en otro lugar, archivos de bases de datos allí, y local Docker tienda de imágenes. |

- La excepción del registro puede hacer grandes archivos.
- El código de restauración busca `/captain/backup.tar` en la instalación inicial y lo expande `/captain/restoring`.
- Consulta [Lo que está respaldado](index.md) y [Restaurar un servidor](restore.md) para la secuencia de recuperación completa.
