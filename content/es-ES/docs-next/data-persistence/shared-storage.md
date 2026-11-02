---
id: shared-storage
title: Almacenamiento compartido / externo
slug: /data-persistence/shared-storage
---

- Los volúmenes Docker son locales a un nodo por defecto.
- Para acceso a los nodos cruzados, utilice almacenamiento compartido montado en cada nodo elegible, o almacene cargas externamente.
- CapRover no proporciona ni replica el almacenamiento compartido.
- Validar permisos, recuperación de fallos y comportamiento de escritura concurrente. Un volumen compartido por sí solo no hace que una base de datos sea segura para múltiples réplicas.
- Retroceder datos compartidos por separado.
