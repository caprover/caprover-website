---
id: disk-cleanup
title: Despk &amp; Cleanup
slug: /server/disk-cleanup
---

- En la configuración de limpieza del disco del panel, elija cuántos **versiones recientes desplegadas por aplicación** para retener.
- CapRover `DiskCleanupManager` escanea imágenes Docker; para cada aplicación que protege la versión desplegada y la anterior `mostRecentLimit` versiones cuando sus etiquetas coinciden con los nombres de imagen de despliegue guardados.
- Luego intenta eliminar imágenes fuera de ese conjunto.

- Para ejecutar la limpieza en un horario, introduzca un valido **expresión cron** y **zona horaria**.
- El programa utiliza la zona horaria configurada.
- Limpiar la expresión deshabilita el trabajo programado; el recuento de retención guardado se reasienta a 1.
- Se rechaza un valor negativo de retención.
- Confirme que las imágenes antiguas están disponibles en un registro o reconstruya antes de eliminarlas; la limpieza puede afectar la devolución.

- Esto es **limpieza de imagen**, no base de datos, volumen, registro o limpieza del registro.
- Inspección `docker system df` y `docker volume ls` antes de cualquier limpieza manual.
- Evite la poda de volumen amplio: un volumen no utilizado todavía puede contener datos importantes para una aplicación parada o rota.
- See [Lo que está respaldado](backup/index.md).
