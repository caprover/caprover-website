---
id: captain-definition
title: Captain Definition
slug: /deployments/captain-definition
---

A `captain-definition` file tells CapRover how to build source or which prebuilt image to deploy. Put it at the root of the uploaded project unless you set a different **Captain Definition Path** for the app. The format is JSON with `schemaVersion: 2`.

For a repository Dockerfile:

```json
{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}
```

For a prebuilt image:

```json
{"schemaVersion":2,"imageName":"nginx:stable-alpine"}
```

Use exactly one build/image source. `dockerfileLines` can define an inline Dockerfile, and `templateId` selects a built-in language template. For a monorepo, set a separate definition path per app; the uploaded project root remains the Docker build context. See the [Captain Definition Schema](../reference/captain-definition.md) for the supported keys and constraints.
