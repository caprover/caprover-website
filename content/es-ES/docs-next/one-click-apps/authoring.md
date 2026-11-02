---
id: authoring
title: Crear plantillas One-Click
slug: /one-click-apps/authoring
---

- Una plantilla One-Click describe los servicios que se instalarán y los parámetros necesarios.
- Según el modelo actual, incluye `captainVersion`, un mapa `services` y metadatos `caproverOneClickApp` con nombre visible, variables e instrucciones de inicio y finalización.
- Los servicios admiten un subconjunto documentado de campos compatibles con Compose, además de `caproverExtra` para ajustes específicos de CapRover relacionados con HTTP y builds.

- Elige cuidadosamente los tags de imágenes, define nombres y validaciones útiles para las variables, conserva los datos de servicios stateful y evita contraseñas predeterminadas inseguras o puertos públicos innecesarios.
- Prueba el instalador en un servidor descartable, revisa todas las aplicaciones generadas, verifica las instrucciones y comprueba tanto una instalación nueva como el procedimiento de recuperación.

- Para nombres de campos y tipos exactos, consulta el [esquema de One-Click Apps](../reference/one-click-schema.md) y el [repositorio actual de one-click-apps](https://github.com/caprover/one-click-apps).
- El catálogo es dinámico: evita documentar una lista fija de aplicaciones como si su disponibilidad estuviera garantizada.
