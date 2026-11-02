---
id: authoring
title: Autorización de aplicaciones de un clic
slug: /one-click-apps/authoring
---

- Una plantilla One-Click describe los servicios y sus entradas de instalación.
- En el modelo actual, una plantilla declara `captainVersion`, a `services` mapa, y `caproverOneClickApp` metadatos con nombre de pantalla, variables y instrucciones de inicio/final.
- Los servicios soportan un subconjunto documentado de campos tipo Compose más `caproverExtra` para HTTP específico de CapRover y configuración de construcción.

- Elija etiquetas de imagen deliberadamente, proporcione etiquetas variables significativas y validación, datos persistentes y evite credenciales predeterminadas inseguras o puertos publicados innecesariamente.
- Prueba la instalación en un servidor desechable, inspecciona cada aplicación generada, verifica las instrucciones y ejerce una instalación fresca y una ruta de recuperación.

- Para nombres y tipos de campo exactos, utilice el [Plan de aplicación de un solo clic](../reference/one-click-schema.md) y la corriente [repositorio de una aplicación de clic](https://github.com/caprover/one-click-apps).
- El catálogo es dinámico; evite documentar una lista fija de nombres de aplicaciones como si estuviera garantizado.
