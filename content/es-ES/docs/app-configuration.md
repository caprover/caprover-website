---
id: app-configuration
title: Configuración de la aplicación
sidebar_label: Configuración de la aplicación
---

<br/>

## Configuración HTTP

Aquí es donde se encuentran todas las cosas relacionadas con HTTP. Si su aplicación no es una aplicación HTTP, simplemente puede marcar "No exponer como aplicación web". Esto se usa para cualquier cosa que no sea una aplicación web, como una base de datos como MongoDB o MySQL.

![Configuración HTTP](/img/docs/app-http.png)

De forma predeterminada, cualquier aplicación web que implemente recibe un dominio Captain asignado en este formato: `appname.root.domain.com`. Sin embargo, tienes la opción de agregar tantos dominios como quieras a esta aplicación. Por ejemplo, puedes agregar `www.myawesomeapp.com` y `myawesomeapp.com`.

También hay algunas opciones avanzadas, como Editar configuración predeterminada Nginx y Puerto de contenedor HTTP, que normalmente no es necesario editar.

#### Habilitando HTTPS

CapRover tiene soporte incorporado para Let's Encrypt y le permite poner fácilmente sus sitios web en un lugar seguro HTTPS sin preocuparse por el costo de los certificados SSL (Let's Encrypt es gratis) y sin la molestia de configurar configuraciones y renovar certificados.

Para habilitar HTTPS para cualquier dominio, simplemente haga clic en habilitar HTTPS. ¡Tarda unos segundos y listo!

Después de habilitar HTTPS, puede opcionalmente, aunque es muy recomendable, aplicar HTTPS para todas las solicitudes, es decir, negar conexiones HTTP simplemente inseguras y redirigirlas a HTTPS.


## Configuración de la aplicación

Aquí es donde puede establecer la configuración y los ajustes del tiempo de ejecución.

![appconfig](/img/docs/app-vars.png)

### Variables de entorno

Una de las configuraciones más básicas que puede establecer para su aplicación son las variables de entorno. Estas variables generalmente se usan para pasar datos que no se encuentran en el código. Los ejemplos incluyen la clave API para un servicio de terceros, conexión de base de datos URI, etc.

Simplemente puede configurar las variables ambientales en el panel y usarlas dinámicamente en su código, por ejemplo, `process.env.VAR_NAME_HERE` para NodeJS o `$_ENV["VAR_NAME_HERE"]` en PHP.

Si desea acceder a estas variables durante el tiempo de compilación, puede usar el comando ARG en su Dockerfile.

```
FROM imagename....
ARG VAR_NAME_HERE=${VAR_NAME_HERE}
ENV VAR_NAME_HERE=${VAR_NAME_HERE}

## At this point, "VAR_NAME_HERE" is available as an env var during your build,
## you can do something like this:
## RUN echo $VAR_NAME_HERE
```

Además de las variables que usted mismo establezca, CapRover también establecerá una variable de entorno `CAPROVER_GIT_COMMIT_SHA` para el SHA de confirmación git completo que se está implementando. Esto solo está disponible durante la compilación Docker y no está disponible dentro de su aplicación de forma predeterminada. Si desea usarlo dentro de su aplicación, puede usar algo como lo siguiente:

```
FROM imagename....
ARG CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
ENV CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
```

### Mapeo de puertos

CapRover le permite asignar puertos desde un contenedor al host. Debe utilizar esta función si desea que un puerto específico de sus aplicaciones/contenedores sea accesible públicamente. El caso de uso más común es cuando desea **conectarse a un contenedor de base de datos desde su máquina local**.

Tenga en cuenta que incluso si no configura ninguna asignación de puertos, se puede acceder a todos los puertos desde otros contenedores en el mismo clúster Captain. Por lo tanto, sólo debes utilizar esta opción si deseas que el puerto sea de acceso público. Asegúrese de tener el puerto abierto, consulte [configuración del firewall](firewall.md).

Por ejemplo, una aplicación Node.js puede conectarse a una aplicación llamada `mongodb-app-name` mediante el host `mongodb-app-name`, sin mapeo de puertos. Las aplicaciones actualizadas desde versiones de CapRover anteriores a 1.15 pueden conservar un nombre de servicio Docker con el prefijo `srv-captain--`, y el alias de red con prefijo sigue disponible por compatibilidad.

### Directorios persistentes

Solo se usa para [aplicaciones persistentes](persistent-apps.md).

### ID de nodo

Solo se usa para [aplicaciones persistentes](persistent-apps.md). Las aplicaciones persistentes deben bloquearse en un nodo en particular (si tiene un grupo de servidores). NodeId define en qué nodo se debe bloquear esta aplicación.

### Etiquetas de servicio

_disponible a partir de 1.11_

Puede marcar los servicios de caprover con etiquetas especiales. Esto le permite agrupar y ver mejor sus aplicaciones en la tabla.

### Recuento de instancias

¿Cuántas instancias de esta aplicación deben ejecutarse al mismo tiempo? Puede ejecutar tantas instancias como desee. Sin embargo, está limitado por su hardware. Si aumenta este número y no tiene suficiente RAM o espacio en disco, su sistema puede fallar. Se recomienda considerar las implicaciones en el rendimiento antes de aumentar este número.

### Función previa a la implementación

Esta es una [opción muy peligrosa y avanzada](pre-deploy-script.md). No lo utilices a menos que realmente sepas lo que estás haciendo.
