---
id: index
title: Aplicaciones
slug: /applications
---

<span id="source-applications-create-manage"></span>

## Ajustes de la aplicación

- **Aplicación web:** Las rutas de CapRover solicitan a través de NGINX al puerto HTTP de contenedor configurado.
- **Servicio privado:** Seleccione **No exponer como aplicación web** para workers o bases de datos sin un punto final HTTP.
- **Dirección de escucha:** Su proceso web debe unirse a `0.0.0.0` dentro del contenedor.
- **Eliminar la aplicación:** Retroceda cualquier volumen Docker, monturas enlazadas o datos externos primero. La eliminación de la aplicación no constituye una copia de seguridad.

Para las opciones de despliegue de fuentes/imagen, véase [Despliegue](../deployments/index.md).

<span id="source-applications-projects"></span>

## Proyectos

- Organizar aplicaciones en proyectos y proyectos anidados.
- Los proyectos son sólo de organización. No proporcionan aislamiento de red ni límite de acceso.

<span id="source-applications-tags-descriptions"></span>

## Etiquetas y descripciones

- Las descripciones y etiquetas facilitan la búsqueda de aplicaciones.
- Las etiquetas pueden abarcar proyectos; ni establecer cambios de redes, despliegue o aislamiento.

<span id="source-applications-environment-variables"></span>

## Variables ambientales

- Las variables de tiempo de ejecución se almacenan con la configuración de servicio de la aplicación.
- Un rollo de imagen hace **no** restaurar valores variables antiguos.
- Configuración de aplicaciones y copias de seguridad CapRover pueden contener secretos. Mantenga las credenciales fuera del repositorio y `captain-definition` Archivos.

Para los argumentos no secretos Dockerfile construye:

```dockerfile
ARG PUBLIC_BUILD_VALUE
ENV PUBLIC_BUILD_VALUE=${PUBLIC_BUILD_VALUE}
```

CapRover también proporciona `CAPROVER_GIT_COMMIT_SHA` durante la fuente construye. Los valores de build pueden estar incrustados en la imagen resultante.

<span id="source-applications-http-settings"></span>

## Ajustes HTTP

- **Dominio predeterminado:** `<app-name>.<root-domain>`Véase [Dominios &quot; HTTPS](../domains/index.md).
- **Puerto HTTP de contenedores:** Debe coincidir con el puerto que el proceso escucha.
- **HTTP Autenticación Básica:** Restricts HTTP access; application-specific user authorization remains separate.
- **Dominios redirigidos:** Confirme el nombre de host de destino es accesible antes de habilitar redirecciones.
- **Puertos públicos TCP/UDP:** Utilice mapas de puertos publicados explícitamente. Consulta [Firewall &amp; Networking](../domains/firewall.md).
