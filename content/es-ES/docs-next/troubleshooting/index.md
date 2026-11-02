---
id: index
title: Solución de problemas
slug: /troubleshooting
---

Para obtener un informe completo del servidor, utiliza [Recopilar diagnósticos](diagnostics.md).

<span id="source-applications-troubleshooting"></span>

## La aplicación no responde o devuelve HTTP 502

- Revisa los logs de despliegue y del servicio.
- Comprueba que el contenedor escucha en `0.0.0.0` y que **Container HTTP Port** coincide con el puerto real de la aplicación.
- Ejecuta `docker service ps SERVICE_NAME` para detectar errores de tareas.
- Si faltan datos, comprueba el volumen montado y el nodo que está ejecutando la tarea.

<span id="source-deployments-troubleshooting"></span>

## Fallos de despliegue

| Etapa | Qué comprobar |
| --- | --- |
| Git fetch | URL del repositorio, rama, credenciales de despliegue, conexión de red |
| Build | Primer error del build, Dockerfile / `captain-definition`, RAM, disco |
| Image pull | Disponibilidad del registry, tag de imagen y credenciales; todos los nodos deben poder hacer pull |
| Actualización del servicio | `docker service ps SERVICE_NAME` y logs del servicio |

<span id="source-domains-troubleshooting"></span>

## DNS, HTTPS y enrutamiento

1. **DNS:** comprueba los registros A/AAAA del dominio, wildcard DNS y el modo proxy.
2. **Conectividad:** comprueba los puertos públicos `80/tcp` y `443/tcp`, incluido el firewall del proveedor.
3. **Enrutamiento HTTP:** verifica el puerto del contenedor, su listener y el estado de la tarea Docker.
4. **Certificados:** consulta los logs de Certbot y la accesibilidad de HTTP-01.
5. **Bucles de redirección:** revisa Force HTTPS, redirecciones personalizadas y proxies externos.

**Error de verificación de dominio 1107:** asegúrate de que el nombre de host público apunta a este servidor y es accesible por el puerto 80. Para redes privadas, consulta [Instalación avanzada](../installation/advanced/index.md) y la opción `skipVerifyingDomains`. Esa opción no configura DNS ni proporciona certificados TLS públicos.

<span id="source-data-persistence-troubleshooting"></span>

## Almacenamiento y bases de datos

- **Conexiones inactivas a la base de datos que caducan:** configura keepalive y reintentos en el cliente. Comprueba la red Docker antes de modificar CapRover.
- **Datos perdidos:** revisa la ruta montada dentro del contenedor, el volumen Docker o bind mount real y el nodo que ejecuta la tarea.
- **Errores de permisos:** comprueba el UID del contenedor, montajes de solo lectura, existencia del directorio y espacio libre.
- **Problemas de acceso externo a la base de datos:** verifica la salud del servicio, listener, autenticación, puerto publicado en el host y firewall.
- Conserva los volúmenes y las rutas del host durante el diagnóstico. Consulta [Backup de datos persistentes](../data-persistence/backup-data.md).

<span id="source-scaling-troubleshooting"></span>

## Fallos de Swarm y multinodo

- **No se puede unir un nodo:** comprueba el registry de push predeterminado, SSH, el estado Swarm inactive del nodo nuevo y los puertos entre nodos.
- **Tareas Pending o reiniciándose:** inspecciona `docker node ls`, `docker service ps SERVICE_NAME`, errores de pull, restricciones de scheduling y memoria disponible.
- **Se trasladó una tarea persistente:** los datos de volúmenes locales no se mueven automáticamente con ella.
- Revisa el firewall del proveedor después de que CapRover modifique reglas de UFW al unir nodos.

<span id="source-troubleshooting-support"></span>

## Soporte

- Preguntas de uso: [GitHub Discussions](https://github.com/caprover/caprover/discussions)
- Bugs reproducibles: [GitHub Issues](https://github.com/caprover/caprover/issues)
- Comunidad: [Slack de CapRover](https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA)
- Consultoría de pago: `support@caprover.com`. Soporte relacionado con suscripciones Pro: `pro.support@caprover.com`.

<span id="source-troubleshooting-report-bug"></span>

## Reportar un bug

Para defectos del producto, utiliza [Issues de CapRover](https://github.com/caprover/caprover/issues). Para problemas de documentación, utiliza [Issues del sitio web](https://github.com/caprover/caprover-website/issues).

Incluye la versión, sistema operativo y Docker, método de despliegue, pasos para reproducir, resultado esperado y real, y logs redactados. Antes de compartirlos, elimina contraseñas, tokens, claves privadas y datos personales.
