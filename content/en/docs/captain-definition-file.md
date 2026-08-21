---
id: captain-definition-file
title: Captain Definition File
sidebar_label: Captain Definition File
---

## Basics

A `captain-definition` file at the root of a project tells CapRover how to build or deploy it. The file uses JSON and requires `schemaVersion: 2`.

For a Node.js app:

```json
{
  "schemaVersion": 2,
  "templateId": "node/24"
}
```

`templateId` uses the `LANGUAGE/VERSION` format. The built-in templates are `node`, `php`, `python-django`, and `ruby-rack`. CapRover resolves the version from the corresponding official container image at build time.

For new production applications, a repository-owned Dockerfile usually provides the clearest and most reproducible build. It also supports any language or runtime.

## Use a Dockerfile

Reference a Dockerfile in the repository:

```json
{
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile"
}
```

The Docker build context is the root of the uploaded project, even when the Dockerfile is in a subdirectory.

You can also define the Dockerfile inline:

```json
{
  "schemaVersion": 2,
  "dockerfileLines": [
    "FROM node:24-alpine",
    "WORKDIR /usr/src/app",
    "COPY package*.json ./",
    "RUN npm install --omit=dev && npm cache clean --force",
    "COPY . .",
    "ENV NODE_ENV=production",
    "ENV PORT=80",
    "EXPOSE 80",
    "CMD [\"npm\", \"start\"]"
  ]
}
```

See Docker's [Dockerfile reference](https://docs.docker.com/reference/dockerfile/) and [build best practices](https://docs.docker.com/build/building/best-practices/) for more options.

## Use an image name

To deploy a prebuilt image from a registry:

```json
{
  "schemaVersion": 2,
  "imageName": "nginxdemos/hello"
}
```

You can paste an image-only definition into the app's **Deployment** tab. The CLI also accepts a prebuilt image through `caprover deploy --imageName IMAGE`.

## Monorepos

A repository can contain a separate definition for each app:

```text
/project
  /frontend
    package.json
  /backend
    package.json
  captain-definition-backend
  captain-definition-frontend
```

In each app's **Deployment** tab, set the Captain Definition Path to the relevant file, such as `./captain-definition-backend`. Dockerfile `COPY` paths remain relative to the project root because the root is the build context.

## Choosing runtime versions

Use an actively supported runtime release and pin it to the level of reproducibility your application requires. Available template versions follow the tags published by the official images:

- [Node.js image tags](https://hub.docker.com/_/node)
- [PHP image tags](https://hub.docker.com/_/php)
- [Python image tags](https://hub.docker.com/_/python)
- [Ruby image tags](https://hub.docker.com/_/ruby)

Changing a floating tag can change the runtime used by a later build. Pin an exact tag or digest when repeatable builds are required.
