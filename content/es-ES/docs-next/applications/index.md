---
id: index
title: Aplicaciones
slug: /applications
---

<span id="source-applications-create-manage"></span>

## Configuración de aplicaciones

- **Aplicación web:** CapRover enruta las peticiones mediante NGINX al puerto HTTP configurado del contenedor.
- **Servicio privado:** selecciona **Do not expose as web app** para workers o bases de datos que no ofrecen un endpoint HTTP.
- **Dirección de escucha:** el proceso web debe escuchar en `0.0.0.0` dentro del contenedor.
- **Eliminar una aplicación:** antes, haz una copia de seguridad de los volúmenes Docker, bind mounts y otros datos externos. Eliminar una aplicación no crea un backup.

Para las opciones de despliegue desde código o imágenes, consulta [Despliegues](../deployments/index.md).

<span id="source-applications-projects"></span>

## Proyectos

- Organiza las aplicaciones en proyectos y subproyectos.
- Los proyectos solo sirven para organizar aplicaciones. No proporcionan aislamiento de red ni control de acceso.

<span id="source-applications-tags-descriptions"></span>

## Etiquetas y descripciones

- Las descripciones y las etiquetas facilitan la búsqueda de aplicaciones.
- Una misma etiqueta puede usarse en distintos proyectos. Ninguna de estas opciones modifica la red, el despliegue ni el aislamiento.

<span id="source-applications-environment-variables"></span>

## Variables de entorno

- Las variables de runtime se guardan en la configuración del servicio de la aplicación.
- Hacer rollback de una imagen **no** restaura los valores anteriores de las variables.
- La configuración de aplicaciones y los backups de CapRover pueden contener secretos. Evita guardar credenciales en el repositorio o en archivos `captain-definition`.

Para pasar argumentos de build que no contienen secretos a un Dockerfile:

```dockerfile
ARG PUBLIC_BUILD_VALUE
ENV PUBLIC_BUILD_VALUE=${PUBLIC_BUILD_VALUE}
```

CapRover también proporciona `CAPROVER_GIT_COMMIT_SHA` durante los builds desde código fuente. Los valores de build pueden quedar incorporados en la imagen resultante.

<span id="source-applications-http-settings"></span>

## Configuración HTTP

- **Dominio predeterminado:** `<app-name>.<root-domain>`. Consulta [Dominios y HTTPS](../domains/index.md).
- **Container HTTP Port:** debe coincidir con el puerto en el que escucha el proceso.
- **HTTP Basic Authentication:** restringe el acceso HTTP; la autorización de usuarios dentro de la aplicación se gestiona por separado.
- **Redirecciones de dominio:** comprueba que el hostname de destino es accesible antes de activar una redirección.
- **Puertos TCP/UDP públicos:** configura explícitamente los puertos publicados. Consulta [Firewall y redes](../domains/firewall.md).
