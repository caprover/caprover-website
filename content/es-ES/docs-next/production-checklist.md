---
id: production-checklist
title: Checklist para producción
slug: /production-checklist
---

Antes de alojar aplicaciones importantes en CapRover, revisa estos puntos:

- **Acceso**
  - Cambia la contraseña inicial.
  - Activa HTTPS en el dashboard y **Force HTTPS**.
  - Restringe el acceso directo al puerto `3000`.
  - Utiliza credenciales con permisos mínimos para la automatización.
- **DNS y HTTPS**
  - Verifica el DNS wildcard.
  - Comprueba los certificados del dashboard y de las aplicaciones.
  - Planifica los cambios de DNS que necesitarías al migrar el servidor.
- **Datos**
  - Utiliza volúmenes o bind mounts para los datos persistentes.
  - Haz backups independientes de bases de datos, archivos subidos y otros datos de las aplicaciones.
  - Ten en cuenta la asignación de nodos cuando utilices almacenamiento local.
- **Recuperación**
  - Guarda los backups de configuración de CapRover fuera del servidor.
  - Prueba la restauración de los datos de las aplicaciones.
  - Documenta la ubicación de las imágenes, los nodos asignados y el acceso al registry.
- **Capacidad**
  - Reserva margen de CPU, RAM y disco para los builds.
  - Monitoriza el uso de disco.
  - Configura la limpieza de imágenes sin perder las versiones que necesites para hacer rollback.
- **Red**
  - Abre únicamente los puertos públicos necesarios.
  - Limita los puertos entre nodos de Swarm a nodos de confianza.
  - Revisa todos los puertos TCP/UDP publicados. Docker puede eludir reglas sencillas de UFW.
- **Actualizaciones**
  - Prueba los despliegues y las actualizaciones con tus aplicaciones.
  - Conserva un backup recuperable.
  - Configura health checks según tus necesidades de disponibilidad.

Empieza por [Primeros pasos](get-started.md). Para el mantenimiento habitual, consulta [Administración del servidor](server/index.md).
