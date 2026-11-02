---
id: index
title: Almacenamiento persistente
slug: /data-persistence
---

<span id="source-data-persistence-stateless-persistent"></span>

## Cuándo utilizar la persistencia

- Uso **Tiene datos persistentes** para bases de datos y aplicaciones que almacenan cargas locales.
- Sólo los caminos de montaje configurados sobreviven el reemplazo de contenedores. La bandera de aplicación persistente por sí sola no guarda archivos de contenedores arbitrarios.
- Las aplicaciones web apátridas pueden utilizar bases de datos externas o almacenamiento de objetos.

<span id="source-data-persistence-volumes"></span>

## Docker volúmenes

- Establecer un **nombre del volumen** y la ruta del contenedor a la que escribe la aplicación.
- PostgreSQL comúnmente utiliza `/var/lib/postgresql/data`; verifique el camino para su imagen.
- Las versiones actuales de CapRover usan el nombre de volumen que introduces. Los volúmenes más antiguos (antes de 1.15) pueden utilizar un `captain--` prefijo; cheque con `docker volume ls`.

Para inspeccionar un volumen huérfano después de la eliminación de la aplicación:

```bash
docker volume ls
docker volume inspect VOLUME_NAME
docker ps -a --filter volume=VOLUME_NAME
```

Sólo después de confirmar la propiedad, no uso y copia de seguridad, eliminar con `docker volume rm VOLUME_NAME`Evitar la amplitud `docker volume prune` en hosts compartidos.

<span id="source-data-persistence-bind-mounts"></span>

## Bind mounts

- Mapa un directorio host absoluto a la ruta de contenedores, como `/srv/app/uploads` → `/app/uploads`.
- Crear la ruta de host y establecer permisos para el usuario del contenedor.
- Evite exponer directorios de host sensibles a contenedores no confiados.

<span id="source-applications-persistent-directories"></span>

## Directorios persistentes

- Configurar los caminos montados en la aplicación **Persistent Directories** Ajustes.
- Verifica que la aplicación ejecutada escribe a la **Carretera de contenedores** Tú montaste.
- Respalde los datos montados por separado de una copia de seguridad de configuración de CapRover.

<span id="source-data-persistence-node-placement"></span>

## Colocación de nodos

- Los volúmenes llamados y monturas enlazadas son típicamente **nodos locales**.
- CapRover coloca aplicaciones persistentes al nodo conteniendo sus datos. Los nombres de directorios idénticos en diferentes nodos no implican contenido compartido.
- Al mover una aplicación persistente: deja de escribir, copia de seguridad, migrar datos, verificar permisos, cambiar la colocación, luego validar los datos restaurados.

<span id="source-guides-persistent-storage"></span>

## Prueba de almacenamiento

Escriba un archivo representativo en la ruta montada, redistribuya la aplicación y verifique que queda. Para bases de datos, utilice una exportación/restauración de datos.

Para almacenamiento compartido a través de los nodos, vea [Almacenamiento compartido](shared-storage.md). Para respaldos y migraciones, vea [Datos persistentes](backup-data.md).
