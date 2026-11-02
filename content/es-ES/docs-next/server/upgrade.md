---
id: upgrade
title: Upgrade CapRover
slug: /server/upgrade
---

Antes de mejorar, [descargar una copia de seguridad CapRover](backup/index.md) y copia de seguridad de datos y volúmenes de aplicaciones. Compruebe las notas de liberación y confirme que su anfitrión Docker tiene suficiente espacio de disco libre.

- En el tablero, abierto **Ajustes** e inspeccionar la versión actual, la versión disponible, y cambiar el registro.
- Utilice la acción de actualización de dashboard cuando reporte que una actualización está disponible.
- CapRover tira la imagen seleccionada y actualiza la `captain-captain` Servicio Docker.
- Permitir el tiempo de servicio para reiniciar, luego verificar el panel de control, aplicaciones desplegadas, registro y HTTPS.

- Si la actualización falla, compruebe `docker service ps captain-captain --no-trunc` y `docker service logs captain-captain --tail 100` en el nodo de gerente.
- Preserve una copia de seguridad y la etiqueta de imagen anterior antes de intentar un rollback; ver [Diagnósticos](../troubleshooting/diagnostics.md).

## Probando una imagen de borde

- Para una prueba temporal avanzada de una solución disponible sólo en la imagen del borde, registre la imagen actual exacta de `docker service inspect captain-captain`, respaldo CapRover y datos de aplicaciones, y luego actualizar la imagen de servicio a **etiqueta de borde probado específico o digest** utilizando `docker service update captain-captain --image IMAGE`.
- Esto supera el flujo normal de la versión del panel.
- Las imágenes de borde pueden no apoyar la reducción a la versión actualmente lanzada; esperar una liberación compatible o restaurar una copia de seguridad probada antes de cambiar de nuevo.
- Verifique el panel de control, aplicaciones y registros de servicio después de cualquier actualización manual.
