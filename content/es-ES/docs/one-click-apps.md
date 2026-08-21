---
id: one-click-apps
title: One-Click Apps
sidebar_label: One-Click Apps
---

<br/>

CapRover tiene soporte integrado para varias aplicaciones populares que se pueden implementar tal cual. Estos incluyen WordPress, MySQL, MongoDB y muchos más.

Hay un repositorio de [One Click Apps en GitHub](https://github.com/caprover/one-click-apps) y está en continuo crecimiento.

![OneClickAppsCapRover](/img/docs/one-click.gif)

<br/><br/>

#### Bases de datos y GUI de base de datos
- MongoDB
- MongoExpress
- MsSQL
- MySQL
- Redis
- PhpMyAdmin
- PostgreSQL
- Adminer
- Apache CouchDB
- Gitea 
- ElasticSearch 
- Y muchos más...
#### Blogs y contenido
- WordPress
- Ghost
- Prisma 1
- Strapi
- Minio
- Y muchos más...
#### Herramientas de desarrollo
- Jenkins
- Drone.io
- Hasura
- Nexus3
- Muchos más...
#### Otras aplicaciones
- Parse
- NextCloud
- Rainloop
- Thumbor
- OhMyForm
- Y muchos más...



<br/>

Gracias a [@8byr0](https://github.com/8byr0), tenemos una **comunidad mantenida** [directorio de aplicaciones](https://wizardly-ptolemy-8fcac8.netlify.app/). Puedes ver el código fuente [aquí](https://github.com/8byr0/caprover-sampleapps-browser).


## ¿Qué pasa con otras aplicaciones?
El hecho de que una aplicación o base de datos no esté disponible como aplicación de un solo clic no significa que no pueda implementarla. Todo lo que necesitas hacer es buscar la imagen Docker de la aplicación que estás buscando. Por ejemplo, antes de que NextCloud estuviera disponible como una aplicación de un solo clic, aún podías implementarla manualmente de esta manera.
![nube siguiente](/img/docs/nextcloud-deploy-manually.png)


Con CapRover v1, es incluso más fácil que el método explicado anteriormente. Desde `captain-definition` ahora es compatible con `imageName`. Puede copiar y pegar esto en la sección de implementación de una aplicación que cree. Ya no es necesario crear archivos `tar` cuando todo lo que necesitas es `imageName`:

```
{
  "schemaVersion": 2,
  "imageName": "nextcloud:12-rc"
}
```
Todas las variables de entorno que puede configurar se enumeran en su página DockerHub: https://hub.docker.com/_/nextcloud/

<br/>

## Ajustes de configuración

Todos vienen con configuraciones preconfiguradas, sin embargo, tendrás la opción de personalizar la configuración. Por ejemplo, la base de datos MySQL utiliza el puerto 3306, pero puede cambiar este puerto a otro si se adapta a sus necesidades.

Es importante mencionar que algunos de estos parámetros de configuración pueden aparecer como variables de entorno en la configuración de su aplicación después de implementarla; sin embargo, sus valores solo se usan en la fase de instalación. es decir, cambiar la contraseña de MySQL cambiando la variable de entorno PASSWORD no funcionará. En su lugar, debes usar los comandos MySQL para cambiar la contraseña. La variable de entorno PASSWORD se utiliza para configurar la contraseña original durante la fase de instalación.

## Actualización de aplicaciones One Click

Entonces implementó su aplicación de un solo clic y, algún tiempo después, aparece una nueva versión y desea actualizar su aplicación. El proceso es diferente para diferentes aplicaciones:

#### Actualización de imagen simple
La mayoría de las aplicaciones de buena calidad te permiten simplemente actualizar la imagen subyacente y ¡listo! Este suele ser el caso para la mayoría de las aplicaciones. Por ejemplo, si tiene un MySQL 5.5 y desea actualizar a 5.7, simplemente puede ir a la pestaña "Implementación", navegar hasta la parte inferior y en **Método 6: Implementar mediante ImageName** simplemente escriba mysql:5.7 y haga clic en implementar.

Los nombres de las imágenes suelen estar en formato `imagename:version` o `account/image:version`. Puede ver la imagen que se implementó en CapRover en el historial de implementación. También puedes ver las nuevas versiones en DockerHub. Por ejemplo, 
- Las versiones `mysql` se pueden encontrar desde aquí: https://hub.docker.com/_/mysql?tab=tags
- Las versiones `portainer/portainer` se pueden encontrar desde aquí: https://hub.docker.com/r/portainer/portainer/tags

Tenga en cuenta que existen otros casos de uso en los que CapRover modifica la imagen original para proporcionar más funcionalidad. Por ejemplo, el contenedor de Redis se modifica para proporcionar una [opción de autenticación](https://github.com/caprover/one-click-apps/blob/af172b6680583487bdeacf230d7abaf9b57f4811/public/v4/apps/redis.yml#L10-L12). En este caso, es más sencillo eliminar la aplicación y volver a crearla. Si la aplicación tiene datos persistentes, asegúrese de **NO ELIMINAR** el volumen al borrar la aplicación y de volver a crearla con exactamente el mismo nombre para que se adjunte el mismo volumen.



#### Otros casos
Algunas aplicaciones tienen una forma diferente de actualizarse, específicamente si tienen datos de código persistentes. WordPress es un buen ejemplo. Para actualizar WordPress, todo lo que necesita hacer es realizar la actualización desde el panel del sitio web de WordPress. A veces, además de eso, es necesario actualizar la imagen subyacente; en ese caso, simplemente siga la guía anterior.


## Conexión a bases de datos

### Conexión dentro del clúster CapRover

Como cada aplicación se ejecuta como un servicio Docker, varias aplicaciones MySQL pueden escuchar en el puerto de contenedor 3306 sin conflictos. Una aplicación PHP del mismo clúster de CapRover puede conectarse a dos bases de datos mediante `mysqlappname1:3306` y `mysqlappname2:3306`. Las aplicaciones actualizadas también pueden conservar el alias de red heredado `srv-captain--APP_NAME`.


### Conexión remota

Sin embargo, si desea conectarse a su base de datos desde una máquina remota (por ejemplo, su computadora portátil), debe asignar un puerto de contenedor a un puerto de servidor. En ese caso, debes asignar dos puertos diferentes en el servidor, por ejemplo:
- El puerto 1001 del servidor va al puerto 3306 de mysql-1.
- El puerto 1002 del servidor va al puerto 3306 de mysql-2.

Se necesita el mapeo de puertos si desea conectarse a una base de datos desde una máquina remota. Puedes leer más al respecto [Captain Configuración - Mapeo de puertos](app-configuration.md#port-mapping).

Después del mapeo de puertos, puede ingresar estos valores para su Cliente de base de datos:
- Host: DIRECCIÓN IP DEL SERVIDOR
- Puerto: PUERTO MAPPED-ON-HOST


Por ejemplo, en el ejemplo explicado anteriormente, `MAPPED-PORT-ON-HOST` es `1001` para `mysql-1` y `1002` para `mysql-2`.

Suponiendo que la IP de su servidor es `123.123.123.123` y su puerto asignado es `9999`:
- Para Mongo DB, usarías `mongodb://dbuser:dbpassword@123.123.123.123:9999/dbname`
- Para MySQL, usarías `HOST: 123.123.123.123`, `PORT: 9999`
- y etc...

**IMPORTANTE:** Después de realizar la asignación de puertos, asegúrese de abrir el puerto del servidor. Por ejemplo, si asignaste el puerto 4444 de tu host (servidor) al puerto 3306 de tu contenedor, debes ejecutar el siguiente comando:

```
ufw allow 4444
```
