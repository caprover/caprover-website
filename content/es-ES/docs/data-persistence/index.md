---
id: index
title: Almacenamiento persistente
slug: /data-persistence
---

<span id="source-data-persistence-stateless-persistent"></span>

## Cuándo usar persistencia

- Activa **Has Persistent Data** para bases de datos y aplicaciones que almacenan archivos subidos localmente.
- Solo se conservan las rutas montadas que hayas configurado. Activar la opción de persistencia no guarda automáticamente cualquier archivo del contenedor.
- Las aplicaciones web stateless pueden utilizar bases de datos o almacenamiento de objetos externos.

<span id="source-data-persistence-volumes"></span>

## Volúmenes Docker

- Configura el **nombre del volumen** y la ruta del contenedor donde escribe la aplicación.
- PostgreSQL suele utilizar `/var/lib/postgresql/data`; verifica la ruta de tu imagen.
- Las versiones recientes de CapRover utilizan el nombre de volumen indicado. Los volúmenes antiguos (anteriores a 1.15) pueden tener el prefijo `captain--`; compruébalo con `docker volume ls`.

Para inspeccionar un volumen huérfano después de eliminar una aplicación:

```bash
docker volume ls
docker volume inspect VOLUME_NAME
docker ps -a --filter volume=VOLUME_NAME
```

Elimina el volumen con `docker volume rm VOLUME_NAME` únicamente después de confirmar a qué pertenecía, que ya no se utiliza y que tienes un backup. Evita usar `docker volume prune` indiscriminadamente en hosts compartidos.

<span id="source-data-persistence-bind-mounts"></span>

## Bind mounts

- Mapea una ruta absoluta del host a la ruta del contenedor, por ejemplo `/srv/app/uploads` → `/app/uploads`.
- Crea el directorio del host y configura los permisos para el usuario del contenedor.
- Evita montar directorios sensibles del host en contenedores no confiables.

<span id="source-applications-persistent-directories"></span>

## Directorios persistentes

- Configura los montajes en **Persistent Directories** de la aplicación.
- Comprueba que la aplicación escribe en la **ruta del contenedor** que has montado.
- Haz backups de esos datos por separado del backup de configuración de CapRover.

<span id="source-data-persistence-node-placement"></span>

## Asignación de nodos

- Los volúmenes con nombre y bind mounts suelen ser **locales a un nodo**.
- CapRover fija las aplicaciones persistentes al nodo que almacena sus datos. La misma ruta en nodos distintos no implica que se comparta el contenido.
- Para mover una aplicación persistente: detén las escrituras, haz un backup, migra los datos, verifica los permisos, cambia el nodo asignado y comprueba los datos restaurados.

<span id="source-guides-persistent-storage"></span>

## Prueba de persistencia

Escribe un archivo de prueba en la ruta montada, vuelve a desplegar la aplicación y comprueba que el archivo sigue allí. Para bases de datos, utiliza un export o backup compatible con el motor.

Para almacenamiento compartido, consulta [Almacenamiento compartido](shared-storage.md). Para copias y migraciones, consulta [Backup de datos persistentes](backup-data.md).
