---
id: builds-logs
title: Builds y logs
slug: /deployments/builds-logs
---

- CapRover construye fuente en el servidor a menos que proporcione una imagen preconstruida.
- Vea la salida de despliegue de la aplicación para el primer comando de build fallar.
- Una build puede fallar de archivos perdidos, un mal archivo Docker, dependencias no disponibles, o RAM o disco insuficiente.

- Una vez que la imagen construye, Docker actualiza el servicio de aplicación.
- Revise los registros de servicio o aplicación por separado si el contenedor sale, falla un cheque de salud, o devuelve un 502.
- El puerto HTTP de contenedor configurado debe coincidir con el puerto de escucha del proceso.

- Para builds exigentes, utilice CI para construir y empujar la imagen fuera del servidor CapRover, luego desplegar esa imagen.
- Para un despliegue estancado, recoger el registro de build, estado de servicio y registros recientes de aplicaciones antes de seguir [Despliegues de solución de problemas](../troubleshooting/index.md).

<span id="source-deployments-versions-rollback"></span>

## Versiones y Rollback

- CapRover registra versiones de imagen para una aplicación.
- Desde el historial de despliegue de la aplicación, elija una versión previamente desplegada para volver a rodar su imagen.
- Compruebe el resultado y la salud de la aplicación antes de reanudar el tráfico.

- Rollback hace **no** restaurar variables ambientales anteriores, dominios, contenidos de volumen o esquema de bases de datos.
- Si la versión más reciente cambió los datos persistentes, confirme que la imagen anterior sigue siendo compatible antes de volver a rodar.
- Mantenga suficiente historia de la imagen o acceso al registro para recuperar la versión que pretende restaurar.

Los controles de salud y los ajustes de actualización afectan cómo se comportan las solicitudes durante una puesta en marcha. Consulta [Health checks y despliegues de tiempo cero](../scaling/index.md) para la planificación de disponibilidad.
