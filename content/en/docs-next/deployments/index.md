---
id: index
title: Deployments
slug: /deployments
---

## Deploy from the Dashboard {source-deployments-dashboard}

- Create an app in **Apps**, open its **Deployment** tab, and choose the input appropriate for your project.
- To deploy an archive, package the project with its `captain-definition` file at the expected path and upload the tar file.
- The dashboard also accepts a Captain Definition pasted into its text input when no source files are needed.

For example, paste this definition to deploy an existing public image:

```json
{"schemaVersion":2,"imageName":"nginx:stable-alpine"}
```

- Start the deployment, watch the build or pull status, then verify the app's container HTTP port and its default domain.
- For a private image, configure registry credentials first.
- See [Deploy a Docker Image](index.md#source-deployments-docker-image).

## Deploy a Docker Image {source-deployments-docker-image}

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
