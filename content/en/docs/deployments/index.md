---
id: index
title: Deployments
slug: /deployments
---

<span id="source-deployments-dashboard"></span>

## Deploy from the Dashboard

- Create an app in **Apps**, open its **Deployment** tab, and choose the input appropriate for your project.
- To deploy an archive, package the project with its `captain-definition` file at the expected path and upload the tar file.
- The dashboard also accepts a Captain Definition pasted into its text input when no source files are needed.

[Deploy an existing Docker image](#deploy-a-docker-image)

<span id="source-deployments-docker-image"></span>

## Deploy a Docker Image

Build and push your image to a registry, or use a public image. Create a CapRover app, then paste an image-only definition into its **Deployment** tab:

```json
{
  "schemaVersion": 2,
  "imageName": "nginx:stable-alpine"
}
```

- The image must be accessible to the CapRover server.
- For a private registry, add its credentials under [Container Registries](registries/index.md) before deploying.
- You can also use `caprover deploy --imageName IMAGE` from the CLI.

- After deployment, set the app's container HTTP port to the port the image actually listens on, or mark a worker/database app as non-web.
- Verify the service and app logs.
- Prefer explicit tags or digests for predictable production rollouts; floating tags may resolve to a different image later.
