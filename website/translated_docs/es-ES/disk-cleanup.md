---
id: disk-cleanup
title: Limpieza de disco
sidebar_label: Limpieza de disco
---

<br/>

Docker usa el disco de diferentes maneras:

## Docker Imágenes
Guardar sus imágenes: las imágenes son archivos comprimidos con su código fuente integrado que implementó en el servidor. Cada vez que implementas una nueva versión de tu código, Docker crea una nueva imagen para la nueva versión y mantiene la imagen anterior de forma predeterminada. Si desea limpiar todas las imágenes "no utilizadas" en su servidor, ejecute
```
docker container prune --force
docker image prune --all
```

Nota importante: utilice este método solo si tiene un registro Docker configurado (local o remoto). Esto se debe a un error existente en Docker, consulte [aquí](https://github.com/caprover/caprover/issues/180) para obtener más detalles sobre el problema y también consulte el [Docker Problema](https://github.com/moby/moby/issues/36295) relacionado.

## Docker Volúmenes
Volúmenes, también conocidos como "Directorios persistentes". Cuando creas una aplicación con datos persistentes, como una base de datos, le asignarás un directorio persistente. Cuando cambia el directorio persistente o cuando elimina su aplicación, ya no necesita los volúmenes. Limpiar volúmenes huérfanos es complicado. Si tiene un volumen útil para una aplicación que "actualmente" falla y no se ejecuta, ese volumen se considera "huérfano" por Docker :( Por lo tanto, para limpiar de forma segura los volúmenes huérfanos, primero verifique si todos sus servicios se están ejecutando mediante:
```
docker service ls
```
En RÉPLICAS, debería ver `1/1`, `2/2`, etc. Si ve un servicio que no se está ejecutando, ¡no continúe! De lo contrario, vaya directamente y limpie los volúmenes huérfanos de la siguiente manera:
```
docker volume prune
```

Alternativamente, puede enumerar primero todos los volúmenes y eliminar solo los que no desee:
```
docker volume ls                          # lists all volumes
docker volume rm volume-name-goes-here    # removes a specific volume
```
