---
id: cdd-migration
title: Migración del capitánDuckDuck
slug: /guides/cdd-migration
---

CaptainDuckDuck es el predecesor de CapRover. Planifique esta migración como una operación de mantenimiento: registre los servicios de funcionamiento, tome una instantánea completa de host y copias de seguridad de datos de aplicaciones, y mantenga una ruta de devolución.

- La documentación anterior relacionada con `dev-scripts/migrate-from-cdd.sh`, pero ese guión es **ausente del actual repositorio CapRover**.
- No ejecute el antiguo comando de migración de una línea contra un servidor de producción.
- Preserve el antiguo servidor o una instantánea completa, incluyendo `/captain` y volúmenes de aplicaciones, y proporcionar una instalación actual independiente CapRover.
- Inventario y redistribuir cada aplicación en el nuevo servidor, restaurar sus datos por separado, luego probar antes de mover DNS.
- Una copia de seguridad CapRover de un servidor moderno no es un formato de importación documentado para el estado CaptainDuckDuck.

- Inspección cada uno `captain-definition`: CapRover utiliza la versión de esquema 2, y Dockerfile `COPY` caminos pueden necesitar actualización desde el histórico `./src/` Prefijo.
- Configure los puertos HTTP contenedor a través de la configuración de la aplicación.
- Compruebe el panel, las rutas de aplicación, datos persistentes y HTTPS antes de terminar la ventana de mantenimiento.
- Para un movimiento a nuevo hardware, también siga [Mover CapRover](../server/backup/restore.md) para el lado actual del servicio del procedimiento.
