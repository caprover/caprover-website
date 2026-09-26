---
id: one-click-schema
title: One-Click App Schema
slug: /reference/one-click-schema
---

A One-Click template is a Compose-like `services` mapping plus `captainVersion` and `caproverOneClickApp`. The [source type](https://github.com/caprover/caprover/blob/master/src/models/IOneClickAppModels.ts) defines metadata:

| Field | Type |
| --- | --- |
| `caproverOneClickApp.displayName` | string |
| `caproverOneClickApp.instructions.start`, `.end` | string |
| `caproverOneClickApp.variables` | array of variable definitions |
| Variable `id`, `label` | required strings |
| Variable `defaultValue`, `validRegex`, `description` | optional strings |

Each service supports the [Compose subset](./docker-compose.md). One-Click variables are substituted in the template during deployment; treat submitted values as sensitive and test substitutions. If `$$cap_appname` is declared, a nonempty value is required. See [One-Click authoring](../one-click-apps/authoring.md) for a task guide and real examples.
