---
id: complete-webapp-tutorial
title: Tutorial completo de aplicaciones web
sidebar_label: Tutorial completo de aplicaciones web
---


<br/>

Este es un tutorial general rápido para ayudarlo a comprender cómo debe diseñar una aplicación que tenga múltiples componentes.

¡Digamos que queremos crear una versión de aplicación web de [HOTDOG o NOT HOTDOG](https://www.theverge.com/2017/6/26/15876006/hot-dog-app-android-silicon-valley)!



## Descripción de la aplicación
Supongamos que queremos crear una aplicación web que muestre una lista de fotos con una línea que describa si la imagen es un hot dog o no, algo como esto:

- <IMAGE> Etiquetas: Hotdog, Fecha de subida: 2017-11-12
- <ANOTHER IMAGE> Etiquetas: NO Hotdog, Fecha de carga: 2017-07-08
- <ANOTHER IMAGE> Etiquetas: Hotdog, Fecha de subida: 2017-07-07
- ....

Cualquiera puede cargar imágenes y nuestra muy inteligente Inteligencia Artificial etiqueta esa imagen con HOTDOG o NOT-HOTDOG, luego guardamos esa imagen en el servidor y también guardamos la fecha de carga y las etiquetas en la base de datos.

## Arquitectura de la aplicación
Para crear esta aplicación, supongamos que decidimos tener los siguientes componentes:
- NodeJS WebApp: (incluidos activos estáticos, aplicación frontend y API)
- PHP Aplicación de carga de imágenes: donde podemos realizar una solicitud POST para guardar una foto en el disco
- MongoDB donde podemos almacenar información de carga (etiquetas, fecha de carga, etc.)
- PYTHON Un servicio de Reconocimiento de Imágenes donde podemos realizar una solicitud POST para saber si la imagen es un HOTDOG o NO HOTDOG

```
                        +---------------------+
                        |                     |
                        |   NodeJS Webapp     |
                        |                     |
        +---------------+------------+--------+-----------------+
        |                            |                          |
        |                            |                          |
        |                            |                          |
        |                            |                          |
        |                            |                          |
+-------v-----------+     +----------v----------+   +-----------v---+
|                   |     |                     |   |               |
| PHP File Uploader |     | Python ImageDetector|   |    MongoDB    |
|                   |     |                     |   |               |
+-------------------+     +---------------------+   +---------------+

```

## Persistencia o no
CapRover te permite indicar si tu aplicación/database/service tiene datos de persistencia o no. Las aplicaciones persistentes pueden tener "directorios persistentes". Estos directorios se conservarán si su aplicación falla y Captain inicia una nueva instancia de esa aplicación. Todos los demás directorios se borrarán y restablecerán a su estado predeterminado si la aplicación falla y Captain inicia una nueva instancia de la aplicación. En nuestro ejemplo:
- WebApp: NO tiene/necesita persistencia.
- Aplicación de carga de imágenes: necesita un directorio persistente donde las imágenes se guardan en el disco (por ejemplo, `/uploaded_files`)
- MongoDB. Por supuesto, esto necesita persistencia (donde almacenamos información), no queremos perder la base de datos, solo porque nuestro MongoDB falló o nuestro servidor se reinició.
- Aplicación de reconocimiento de imágenes PYTHON. Este no necesita guardar ningún dato en el disco. Simplemente recibe una imagen, la procesa y le informa al cliente si la imagen era HOTDOG o NO HOTDOG.

## Creando servicios:
- NodeJS Aplicación web: después de escribir esta aplicación, simplemente crea una aplicación web y le asigna el nombre `my-webapp` en Captain, NO marca la casilla de persistencia e implementa su aplicación.
- Aplicación de carga de imágenes: similar a la aplicación web descrita anteriormente, pero marcaremos la casilla de persistencia al crear la aplicación. Nombra esta aplicación `image-uploader`. Después de eso, vamos a la página de detalles de la aplicación y agregamos un directorio persistente, la ruta del directorio es donde su aplicación almacena las imágenes. Esto depende de su aplicación; en nuestro ejemplo, supongamos que es `/uploaded_files`
- MongoDB: usaremos el instalador de aplicaciones de un solo clic para crear una instancia de MongoDB. Llamaremos a este contenedor `my-mongodb`. Cuando se crea el contenedor (base de datos), puede ir a la página de detalles y verá que Captain asignó automáticamente algunos directorios persistentes a este contenedor. Aquí es donde MongoDB guarda sus datos.
- Python Aplicación de reconocimiento de imágenes: nuevamente, cree una nueva aplicación en Captain. No necesitamos configurar la persistencia para esta aplicación ya que no guarda ninguna información en el disco. Llamemos a esta aplicación `image-processor`.


## Acceso interno
Su aplicación web necesita comunicarse con las aplicaciones de MongoDB, carga y procesamiento de imágenes. Las aplicaciones del mismo clúster de CapRover pueden usar el nombre de la aplicación de destino como nombre de host. Por ejemplo, conéctese desde Node.js a la aplicación `my-mongodb` mediante:
```
mongoose.connect("mongodb://my-mongodb/mydatabase");
```
Por supuesto, puede agregar nombre de usuario y contraseña al URI, consulte [aquí por ejemplo](https://stackoverflow.com/questions/7486623/mongodb-password-with-in-it).

La misma regla se aplica a otros servicios. Por ejemplo, puede acceder a la aplicación de carga de imágenes mediante `http://imageuploader`. Las aplicaciones actualizadas desde versiones de CapRover anteriores a 1.15 también pueden usar el alias de red heredado `srv-captain--APP_NAME`.
