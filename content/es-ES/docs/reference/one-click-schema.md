---
id: one-click-schema
title: Esquema de aplicaciones One-Click
slug: /reference/one-click-schema
---

Una plantilla One-Click combina un mapa `services` similar a Docker Compose con `captainVersion` y `caproverOneClickApp`. El [tipo definido en el código fuente](https://github.com/caprover/caprover/blob/master/src/models/IOneClickAppModels.ts) describe sus metadatos:

| Campo | Tipo |
| --- | --- |
| `caproverOneClickApp.displayName` | string |
| `caproverOneClickApp.instructions.start`, `.end` | string |
| `caproverOneClickApp.variables` | array de definiciones de variables |
| `id` y `label` de cada variable | strings obligatorios |
| `defaultValue`, `validRegex` y `description` de cada variable | strings opcionales |

- Cada servicio admite el [subconjunto de Compose compatible](../deployments/other/docker-compose.md).
- Durante el despliegue, CapRover sustituye las variables One-Click en la plantilla. Trata los valores proporcionados como datos sensibles y comprueba el resultado de la sustitución.
- Si la plantilla declara `$$cap_appname`, debes proporcionar un valor que no esté vacío.
- Consulta [Crear aplicaciones One-Click](../one-click-apps/authoring.md) para ver una guía y ejemplos reales.
