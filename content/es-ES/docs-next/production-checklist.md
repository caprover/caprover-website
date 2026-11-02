---
id: production-checklist
title: Lista de verificación de la producción
slug: /production-checklist
---

Antes de alojar aplicaciones importantes, compruebe:

- **Acceso**
  - Cambiar la contraseña inicial.
  - HTTPS enable y **Fuerza HTTPS**.
  - Restringir el acceso directo al puerto `3000`.
  - Utilice credenciales limitadas para la automatización.
- **DNS y HTTPS**
  - Verifique DNS de comodín.
  - Chequee los certificados de panel y aplicación.
  - Plan de cambios DNS para futuros movimientos del servidor.
- **Datos**
  - Utilice volúmenes o monturas de unión para datos persistentes.
  - Retrocede bases de datos, cargas y otros datos de aplicaciones por separado.
  - Tenga en cuenta la colocación de nodos para almacenamiento local.
- **Recuperación**
  - Almacene la configuración de CapRover copia de seguridad fuera del servidor.
  - Prueba una recuperación de datos de aplicaciones.
  - Grabar lugares de imagen, colocación de nodos y acceso al registro.
- **Capacidad**
  - Deja la CPU, RAM y el audífono del disco para las construcciones.
  - Supervisar el uso del disco.
  - Elija una política de limpieza de imágenes que preserve los rollos útiles.
- **Redes**
  - Abrir sólo los puertos públicos necesarios.
  - Restringir los puertos internodos de Swarm a los nodos de confianza.
  - Revise cada puerto de aplicación TCP/UDP publicado. Los puertos docker-publicados pueden pasar por alto reglas UFW simples.
- **Actualizaciones**
  - Prueba implementaciones y actualizaciones contra tus aplicaciones.
  - Mantenga una copia de seguridad recuperable.
  - Configure los controles de salud para sus necesidades de disponibilidad.

Empieza con [Comienzo](get-started.md). Para el mantenimiento continuo, véase [Administración del servidor](server/index.md).
