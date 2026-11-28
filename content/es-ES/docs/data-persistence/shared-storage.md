---
id: shared-storage
title: Almacenamiento compartido o externo
slug: /data-persistence/shared-storage
---

- Por defecto, los volúmenes Docker pertenecen a un único nodo.
- Si varios nodos necesitan acceder a los mismos datos, utiliza almacenamiento compartido montado en todos los nodos correspondientes o guarda los archivos subidos en un servicio externo.
- CapRover no aprovisiona ni replica almacenamiento compartido.
- Comprueba permisos, recuperación ante fallos y escrituras concurrentes. Compartir un volumen no hace que una base de datos admita automáticamente varias réplicas.
- Haz backups independientes de los datos compartidos.
