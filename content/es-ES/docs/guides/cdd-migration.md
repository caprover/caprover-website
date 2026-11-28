---
id: cdd-migration
title: Migrar desde CaptainDuckDuck
slug: /guides/cdd-migration
---

CaptainDuckDuck es el proyecto anterior a CapRover. Planifica esta migración como una operación de mantenimiento: documenta los servicios en ejecución, crea un snapshot completo del host, haz backups de los datos de las aplicaciones y prepara una opción de rollback.

- La documentación antigua enlazaba a `dev-scripts/migrate-from-cdd.sh`, pero ese script **ya no está en el repositorio actual de CapRover**.
- No ejecutes el antiguo comando de migración de una línea en un servidor de producción.
- Conserva el servidor original o un snapshot completo, incluidos `/captain` y los volúmenes de las aplicaciones, y prepara una instalación nueva de CapRover.
- Inventaría y vuelve a desplegar cada aplicación en el servidor nuevo. Restaura sus datos por separado y prueba todo antes de cambiar DNS.
- Un backup de una versión moderna de CapRover no es un formato de importación documentado para el estado de CaptainDuckDuck.

- Revisa los archivos `captain-definition`: CapRover usa la versión 2 del esquema y puede ser necesario actualizar las rutas `COPY` de los Dockerfiles para eliminar el antiguo prefijo `./src/`.
- Configura los puertos HTTP de los contenedores desde los ajustes de cada aplicación.
- Comprueba el dashboard, el enrutamiento de las aplicaciones, los datos persistentes y HTTPS antes de terminar el mantenimiento.
- Si migras a hardware nuevo, sigue también la guía [Mover CapRover](../server/backup/restore.md) para los pasos correspondientes al servidor actual.
