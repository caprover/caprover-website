---
id: upgrade
title: Actualizar CapRover
slug: /server/upgrade
---

Antes de actualizar, [descarga un backup de CapRover](backup/index.md) y haz copias independientes de los datos y volúmenes de las aplicaciones. Revisa las notas de la versión y comprueba que el host Docker tenga suficiente espacio libre.

- En el dashboard, abre **Settings** y comprueba la versión instalada, la versión disponible y el changelog.
- Cuando el dashboard indique que hay una actualización, usa su opción de actualización.
- CapRover descarga la imagen seleccionada y actualiza el servicio Docker `captain-captain`.
- Espera a que se reinicie el servicio y comprueba el dashboard, las aplicaciones, el registry y HTTPS.

- Si falla la actualización, ejecuta `docker service ps captain-captain --no-trunc` y `docker service logs captain-captain --tail 100` en el nodo manager.
- Conserva un backup y la etiqueta de la imagen anterior antes de intentar un rollback. Consulta [Diagnósticos](../troubleshooting/diagnostics.md).

## Probar una imagen edge

- Para probar temporalmente un fix que solo está disponible en la imagen edge, anota la imagen actual con `docker service inspect captain-captain`, realiza backups de CapRover y de las aplicaciones y actualiza el servicio a una **etiqueta o digest edge específico y probado** con `docker service update captain-captain --image IMAGE`.
- Este procedimiento evita el sistema habitual de versiones del dashboard.
- Puede que una imagen edge no permita volver a la versión estable anterior. Antes de regresar, espera una versión compatible o restaura un backup probado.
- Después de cualquier actualización manual, comprueba el dashboard, las aplicaciones y los logs del servicio.
