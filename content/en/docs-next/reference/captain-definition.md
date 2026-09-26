---
id: captain-definition
title: Captain Definition Schema
slug: /reference/captain-definition
---

A file named `captain-definition` at the deployment root tells CapRover what to deploy. Its [source interface](https://github.com/caprover/caprover/blob/master/src/models/ICaptainDefinition.ts) contains `schemaVersion` and four possible deployment selectors.

| Field | Type | Meaning |
| --- | --- | --- |
| `schemaVersion` | number | Required; the current parser accepts `2`. |
| `imageName` | string | Pull and deploy an existing Docker image. |
| `dockerfilePath` | string | Path to a Dockerfile in the deployment archive. Parent-directory paths are rejected. |
| `dockerfileLines` | string[] | Lines of an inline Dockerfile. |
| `templateId` | string | Use a built-in Dockerfile template. |

Provide **exactly one** of the four selectors. The [parser](https://github.com/caprover/caprover/blob/master/src/user/ImageMaker.ts) rejects zero or multiple selectors.

```json
{"schemaVersion": 2, "imageName": "nginx:stable-alpine"}
```

`imageName` deployments cannot be rebuilt from source without a new definition. For an example with a Dockerfile, see [Static / React](../guides/static-react.md).
