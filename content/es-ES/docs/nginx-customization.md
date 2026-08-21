---
id: nginx-customization
title: Configuración de NGINX
sidebar_label: Configuración de NGINX
---

## Personalización de configuración

Aunque CapRover administra automáticamente todo lo relacionado con el enrutamiento de solicitudes HTTP a sus aplicaciones, es posible que todavía haya algunos valores de configuración especiales que desee modificar manualmente. Puede ser una lógica de almacenamiento en caché especial para un tipo de archivo o ruta especial, personalización del tiempo de espera, tamaño máximo del cuerpo y muchos más parámetros que puede ajustar manualmente mediante nginx.

CapRover le permite ajustar manualmente estos parámetros a través de archivos de configuración totalmente personalizados. Hay tres áreas en las que puede ajustar los parámetros:

- NGINX Archivo de configuración base (`/etc/nginx/nginx.conf` dentro del contenedor). Este es el primer archivo que examinará NGINX. Redirige a nginx para buscar otros archivos de configuración. Puede modificar manualmente este archivo en el panel web, configuración.
- CapRover Archivo de configuración (`/etc/nginx/conf.d/captain-root.conf` dentro del contenedor). Este es el archivo de configuración con el que usted, el desarrollador, interactuará cuando visite `captain.root.domain.com`. Normalmente, no debería necesitar modificar este archivo. Pero si lo necesitas, puedes modificarlo en el panel web > configuración
- Archivo de configuración específico de la aplicación (`/etc/nginx/conf.d/captain.conf` dentro del contenedor). Aquí es donde puede cambiar la configuración específica de la aplicación. Digamos que tienes una aplicación para subir videos en la que deseas permitir que el tamaño del cuerpo entrante sea de 1 GB. Puede hacerlo yendo al panel web > Aplicaciones > Editar aplicaciones y cambiar manualmente este parámetro. Tenga en cuenta que cualquier cambio que realice solo se aplica a esta aplicación específica; todas las demás aplicaciones usarán la configuración predeterminada. Esta plantilla de configuración se aplicará a TODOS LOS DOMINIOS que apunten a la aplicación, es decir, Captain crea un bloque de servidor para `my-app-name.captainroot.domain.com` y potencialmente otro bloque de servidor `www.myapp.com` y etc...

Una vez que haya cambiado la plantilla, podrá ver la versión compilada de sus configuraciones nginx en `/captain/generated/nginx` desde la imagen `caprover/caprover` Docker (`docker exec -it docker_container_id /bin/sh`) para verificar si la versión compilada final es la que desea examinando los archivos que se enumeran a continuación. Tenga en cuenta que NO PUEDE modificar MANUALMENTE estos archivos, ya que serán anulados por Captain. Si desea realizar algún cambio, siempre debe cambiar la plantilla Nginx en el panel CapRover.

- `/captain/generated/nginx/nginx.conf` – generado NGINX Archivo de configuración base
- `/captain/generated/nginx/conf.d/captain-root.conf` – generado CapRover Archivo de configuración
- `/captain/generated/nginx/conf.d/captain.conf` – archivo de configuración específico de la aplicación generado

## Archivos y directorios personalizados

Además de la personalización de la configuración, es posible que necesites usar algunos archivos en tu contenedor nginx, cosas como certificados SSL personalizados, activos estáticos específicos, etc. Dado que en el caso CapRover, todo (incluido nginx) está en un contenedor separado, necesitarás asignar un directorio desde tu host al contenedor. Captain ya hizo eso por ti. El directorio `/captain/data/nginx-shared` en su servidor está disponible en su contenedor nginx como `/nginx-shared`. Digamos que coloca un certificado SSL personalizado en esa carpeta y lo llama `/captain/data/nginx-shared/custom-cert.pem`. Para hacer referencia a ese archivo en su configuración nginx, usará `/nginx-shared/custom-cert.pem`


## Personaliza y anula la configuración NGINX para todas las aplicaciones

NOTA: esto estará disponible a partir de la versión 1.11

Para modificar la configuración predeterminada NGINX para que las aplicaciones recién creadas se agreguen a la lista blanca IP y otras configuraciones NGIX.

1- Obtener una copia de la plantilla `server-block-conf.ejs` del repositorio CapRover GitHub. [**aquí**](https://github.com/caprover/caprover/blob/master/template/server-block-conf.ejs)

2- Crea el archivo `/captain/data/server-block-conf-override.ejs`, copia el contenido de la plantilla y realiza las modificaciones deseadas.
Suponiendo que comienzas CapRover Docker con `-v /captain:/captain` (configuración predeterminada)

3- Reinicia tu CapRover para que se consuma el contenido del archivo de anulación: `docker service update --force captain-captain`
