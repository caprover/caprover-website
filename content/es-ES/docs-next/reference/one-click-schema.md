---
id: one-click-schema
title: Esquema One-Click
slug: /reference/one-click-schema
---

Una plantilla de un clic es una combinación `services` asignación más `captainVersion` y `caproverOneClickApp`El [Tipo fuente](https://github.com/caprover/caprover/blob/master/src/models/IOneClickAppModels.ts) define metadatos:

| Campo | Tipo |
| --- | --- |
| `caproverOneClickApp.displayName` | cadena de texto |
| `caproverOneClickApp.instructions.start`, `.end` | cadena de texto |
| `caproverOneClickApp.variables` | array de definiciones variables |
| Variable `id`, `label` | cadenas obligatorias |
| Variable `defaultValue`, `validRegex`, `description` | cadenas opcionales |

- Cada servicio admite [Subconjunto de composición](../deployments/other/docker-compose.md).
- Las variables One-Click se sustituyen en la plantilla durante el despliegue; tratar los valores presentados como substituciones sensibles y de prueba.
- Si `$$cap_appname` es declarado, se requiere un valor no vacío.
- Consulta [Autorización de un clic](../one-click-apps/authoring.md) para una guía de tareas y ejemplos reales.
