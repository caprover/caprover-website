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

## Built-in templates and versions

`templateId` has the form `NAME/VERSION`, for example:

```json
{"schemaVersion":2,"templateId":"node/24"}
```

CapRover's [template definitions](https://github.com/caprover/caprover/blob/master/src/user/TemplateHelper.ts) generate Dockerfiles using these official image tags:

| `NAME` | Base image for `NAME/VERSION` |
| --- | --- |
| `node` | `node:VERSION-alpine` |
| `php` | `php:VERSION-apache` |
| `python-django` | `python:VERSION-alpine` |
| `ruby-rack` | `ruby:VERSION-alpine` |

For `node/24`, the resulting base is `node:24-alpine`. The tag must exist in the relevant upstream image registry, and a major-only tag can move as that image is updated. Template-specific Dockerfile instructions are in CapRover's [`dockerfiles` directory](https://github.com/caprover/caprover/tree/master/dockerfiles). Inspect them before relying on a template's framework assumptions or changing versions. A repository-owned Dockerfile lets you pin an exact image tag or digest and control the build for other frameworks.
