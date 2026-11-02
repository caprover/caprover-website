---
id: index
title: Solución de problemas
slug: /troubleshooting
---

Para un informe completo del host, uso [Recopilar diagnósticos](diagnostics.md).

<span id="source-applications-troubleshooting"></span>

## Aplicación no disponible o HTTP 502

- Compruebe la despliegue de la aplicación y los registros de servicio.
- Confirmar el contenedor escucha en `0.0.0.0` y eso **Container HTTP Port** coincide con el proceso.
- Inspección `docker service ps SERVICE_NAME` para fracasos de tareas.
- Para los datos faltantes, inspeccione el volumen configurado y el nodo que acoge la tarea.

<span id="source-deployments-troubleshooting"></span>

## Fallos en el despliegue

| Fallo | Check |
| --- | --- |
| Git fetch | URL, rama, despliegue de credenciales, acceso a la red |
| Build | Error de primera build, Dockerfile / `captain-definition`, RAM, disco |
| Impresión de imagen | Disponibilidad de registro, etiqueta de imagen y credenciales; cada nodo en un clúster debe tirar |
| Actualización del servicio | `docker service ps SERVICE_NAME` y registros de servicios |

<span id="source-domains-troubleshooting"></span>

## DNS, HTTPS y routing

1. **DNS:** Compruebe los registros A/AAAA del nombre de host, DNS de comodín y modo proxy.
2. **Responsabilidad:** Check public `80/tcp` y `443/tcp`, incluyendo cortafuegos de proveedores.
3. **HTTP routing:** Verifique el puerto de contenedores, el oyente y el estado de tarea Docker.
4. **Certificados:** Compruebe los registros Certbot y la capacidad de acceso HTTP-01.
5. **Redirect loops:** Check Force HTTPS, redirecciones personalizadas y proxies de corriente.

**Error de verificación de dominio 1107:** Compruebe que el nombre de host público exacto resuelve a este servidor y es accesible en el puerto 80. Para redes privadas, vea [Instalación avanzada](../installation/advanced/index.md) y su `skipVerifyingDomains` estableciendo. La anulación no proporciona certificados DNS o TLS públicos.

<span id="source-data-persistence-troubleshooting"></span>

## Almacenamiento y bases de datos

- **Idle database connections timing out:** Utilice la configuración de reingreso de conexión de su cliente y configuración de mantenimiento, y verifique el estado de red Docker antes de cambiar la configuración de CapRover.

- Datos perdidos: Revise la ruta de montaje del contenedor, el volumen real de Docker o la ruta de montaje del bind, y la colocación de tareas.
- Errores de permiso: Chequee el contenedor UID, banderas de sólo lectura, existencia de directorios y capacidad de disco.
- Insuficiencias externas de la conexión de la base de datos: Verificar la salud interna de la base de datos, el oyente/autenticación, el puerto del host publicado y el cortafuegos.
- Presentar volúmenes y rutas de acogida durante la investigación. Consulta [Datos persistentes](../data-persistence/backup-data.md).

<span id="source-scaling-troubleshooting"></span>

## Problemas de Docker Swarm y clúster multinodo

- **Fallo al unir el nodo:** Confirme un registry de push predeterminado está configurado, funciona SSH, el Swarm del nodo de unión es inactivo, y los puertos de nodo a nodo confiable son accesibles.
- **Task pending/restarting:** Inspección `docker node ls`, `docker service ps SERVICE_NAME`, logs de imagen, restricciones de colocación y memoria disponible.
- **Se realizó una tarea con datos persistentes:** Los datos sobre los volúmenes locales no se mueven automáticamente con la tarea.
- Restricciones de firewall del proveedor de revisión después de que CapRover modifique las reglas UFW durante la unión del nodo.

<span id="source-troubleshooting-support"></span>

## Apoyo

- [Discusiones GitHub](https://github.com/caprover/caprover/discussions) para preguntas de uso
- [Problemas de GitHub](https://github.com/caprover/caprover/issues) para defectos reproducibles
- [CapRover Slack la comunidad](https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA) para la ayuda comunitaria
- Para consulta pagada, contacto `support@caprover.com`. Los suscriptores Pro pueden utilizar `pro.support@caprover.com` para soporte de suscripción.

<span id="source-troubleshooting-report-bug"></span>

## Reportar un error

Uso [Temas de CapRover](https://github.com/caprover/caprover/issues) para defectos de producto, o [Web site issues](https://github.com/caprover/caprover-website/issues) para defectos de documentación.

Incluya la versión, detalles Docker/OS, método de despliegue, pasos de reproducción, comportamiento esperado/real y registros sanitarios. Eliminar todas las contraseñas, tokens, claves privadas y datos personales antes de compartir.
