---
id: backup-data
title: Copias de seguridad de datos persistentes
slug: /data-persistence/backup-data
---

Un backup de CapRover guarda su estado y configuración, **pero no** incluye automáticamente los datos de todos los volúmenes Docker, directorios del host o bases de datos externas. Necesitas un plan de backups para los datos de cada aplicación.

1. Identifica los volúmenes, las rutas de bind mounts, el servicio de base de datos y cualquier almacenamiento externo. Usa `docker volume ls` para comprobar los nombres reales; algunas instalaciones antiguas utilizan el prefijo `captain--`.
2. Para las bases de datos, usa el mecanismo de dump o snapshot consistente recomendado por su motor. Para archivos subidos, copia el directorio montado o el object storage con un procedimiento que tenga en cuenta las escrituras concurrentes.
3. Guarda las copias fuera del servidor, protégelas como datos sensibles y define políticas de retención y cifrado.
4. Restaura los backups en una aplicación o servidor de prueba y comprueba que los registros y archivos sean correctos. Documenta las versiones de las aplicaciones, imágenes y bases de datos necesarias para recuperarlos.

Realiza el backup de la configuración de CapRover por separado mediante [Backup y restauración de CapRover](../server/backup/index.md). Un plan de recuperación ante desastres necesita tanto los datos como las imágenes del registry necesarias para ejecutar las aplicaciones.

<span id="source-data-persistence-move-data"></span>

## Mover datos persistentes

- Al mover una aplicación con datos persistentes, también debes migrar sus datos y actualizar la configuración de CapRover.
- Identifica primero el volumen o bind mount real y el nodo donde están los datos.
- Haz un backup y detén las escrituras, o pon la aplicación en mantenimiento, para obtener una copia consistente.

- Crea la ruta o el volumen en el nodo de destino, transfiere o restaura los datos y verifica el propietario y los permisos que necesita el usuario del contenedor.
- Actualiza el nodo asignado y la configuración de almacenamiento de la aplicación cuando el destino esté preparado.
- Inicia una única instancia, comprueba los registros o archivos esperados y conserva el backup de origen hasta verificar la recuperación.

- Para bases de datos, utiliza preferiblemente su mecanismo de migración o dump/restore; evita copiar archivos de datos mientras el motor está funcionando.
- Si vas a mover todo el servidor, consulta [Mover CapRover a otro servidor](../server/backup/restore.md) para los pasos del plano de control.
