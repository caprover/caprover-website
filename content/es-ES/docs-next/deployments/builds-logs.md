---
id: builds-logs
title: Builds y logs de compilación
slug: /deployments/builds-logs
---

- CapRover compila el código fuente en el servidor, salvo que proporciones una imagen ya construida.
- Si falla un build, busca en los logs el primer comando que devuelve un error.
- Los errores pueden deberse a archivos faltantes, un Dockerfile incorrecto, dependencias inaccesibles o falta de RAM o disco.

- Una vez compilada la imagen, Docker actualiza el servicio de la aplicación.
- Si el contenedor termina, falla un health check o devuelve un 502, revisa por separado los logs del servicio y de la aplicación.
- El puerto HTTP configurado del contenedor debe coincidir con el puerto en el que escucha el proceso.

- Para builds pesados, utiliza CI para construir y publicar la imagen fuera del servidor CapRover y luego despliega esa imagen.
- Si un despliegue queda bloqueado, recopila el log del build fallido, el estado del servicio y los últimos logs de la aplicación antes de seguir la guía de [Solución de problemas de despliegue](../troubleshooting/index.md).

<span id="source-deployments-versions-rollback"></span>

## Versiones y rollback

- CapRover guarda el historial de versiones de imágenes de cada aplicación.
- Desde el historial de despliegues, elige una versión anterior para hacer rollback de la imagen.
- Comprueba el resultado y la salud de la aplicación antes de reanudar el tráfico.

- Un rollback **no** restaura variables de entorno anteriores, dominios, datos de volúmenes ni el esquema de la base de datos.
- Si la nueva versión modificó datos persistentes, comprueba la compatibilidad de la imagen anterior antes de hacer rollback.
- Conserva suficientes imágenes en el historial o acceso al registry para recuperar la versión a la que quieras volver.

Los health checks y la configuración de actualización determinan cómo se atienden las peticiones durante el despliegue. Consulta [Health checks y despliegues sin downtime](../scaling/index.md) para planificar la disponibilidad.
