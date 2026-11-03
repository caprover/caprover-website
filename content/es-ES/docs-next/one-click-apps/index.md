---
id: index
title: One-Click Apps
slug: /one-click-apps
---

<span id="source-one-click-apps-install"></span>

## Instalación

Las plantillas One-Click crean aplicaciones normales de CapRover. Una plantilla puede instalar varios servicios.

- Revisa las variables obligatorias, imágenes, puertos publicados, volúmenes e instrucciones posteriores a la instalación.
- Utiliza credenciales únicas para las bases de datos y las cuentas de administrador.
- Los servicios persistentes necesitan **copias de seguridad independientes de los datos de aplicación**. El backup de configuración de CapRover no incluye los volúmenes de bases de datos.
- Consulta el catálogo del dashboard para ver las plantillas y versiones disponibles actualmente.

<span id="source-one-click-apps-configure"></span>

<span id="ajustes-de-configuración"></span>

## Configuración

- Puedes configurar las aplicaciones generadas desde sus ajustes normales de CapRover.
- Algunas variables, como la contraseña inicial de una base de datos, solo se aplican **durante el primer arranque**. Cambiar la variable de entorno después no modifica necesariamente la contraseña de un usuario ya creado.

<span id="source-one-click-apps-connect"></span>

## Conectar servicios

- Ejemplo de conexión interna: `postgres:5432`. Utiliza el nombre real del servicio generado y su puerto interno.
- Las aplicaciones antiguas pueden conservar el alias de servicio `srv-captain--`.
- Guarda las credenciales en las variables de entorno de la aplicación que las utiliza.
- Para clientes externos a CapRover, consulta [Conexiones externas a bases de datos](../data-persistence/deploy-databases.md).

<span id="source-one-click-apps-upgrade"></span>

<span id="actualización-de-aplicaciones-one-click"></span>

## Actualizaciones

En **Deployment**, abre **Method 6: Deploy via ImageName**, introduce la imagen con el nuevo tag y despliega. Sigue las instrucciones de actualización del proyecto original para las migraciones y los backups de datos.

Si la plantilla usa una imagen personalizada o scripts de inicialización, comprueba qué configuran antes de sustituir la imagen.

<span id="source-one-click-apps-custom-repositories"></span>

## Repositorios personalizados

CapRover permite cargar plantillas desde repositorios One-Click de terceros.

- Revisa el código de las plantillas antes de desplegarlas: pueden ejecutar imágenes, publicar puertos, montar almacenamiento y configurar credenciales.
- Registra de qué repositorio procede cada aplicación para poder actualizarla después.
- Consulta [Crear plantillas One-Click](authoring.md) para publicar tu propia plantilla.

<span id="source-one-click-apps-troubleshooting"></span>

## Solución de problemas

Identifica qué servicio generado está fallando. Revisa sus logs y comprueba:

- Variables de la plantilla, errores de pull/build de la imagen y credenciales.
- Puertos publicados, nombres de servicio internos, volúmenes y restricciones de ubicación.
- Si una base de datos se inició accidentalmente con un volumen local vacío en otro nodo.

Conserva los volúmenes con estado mientras investigas. Si solicitas ayuda, comparte logs sin secretos, nombre de la plantilla y versiones de las imágenes.
