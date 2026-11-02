---
id: disk-cleanup
title: Disco y limpieza de imágenes
slug: /server/disk-cleanup
---

- En los ajustes de limpieza de disco del dashboard, elige cuántas **versiones desplegadas recientemente de cada aplicación** quieres conservar.
- El `DiskCleanupManager` de CapRover recorre las imágenes Docker. Para cada aplicación, protege la versión desplegada y las `mostRecentLimit` versiones anteriores cuando sus tags coinciden con los nombres de imagen guardados en el historial.
- Después intenta eliminar las imágenes que quedan fuera de ese conjunto.

- Para programar la limpieza, introduce una **expresión cron** y una **zona horaria** válidas.
- La tarea utiliza la zona horaria configurada.
- Borrar la expresión desactiva la tarea programada; el número de versiones que se conservan vuelve a 1.
- No se admiten valores negativos de retención.
- Antes de eliminar imágenes antiguas, comprueba que puedas recuperarlas desde un registry o volver a compilarlas: la limpieza puede impedir un rollback.

- Esta función limpia **imágenes Docker**; no elimina bases de datos, volúmenes, logs ni datos del registry.
- Comprueba `docker system df` y `docker volume ls` antes de cualquier limpieza manual.
- Evita eliminar volúmenes indiscriminadamente: un volumen sin uso puede contener datos importantes de una aplicación detenida o con fallos.
- Consulta [Qué incluye un backup](backup/index.md).
