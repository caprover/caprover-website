---
id: docker-image
title: Deploy a Docker Image
slug: /deployments/docker-image
---

Build and push your image to a registry, or use a public image. Create a CapRover app, then paste an image-only definition into its **Deployment** tab:

```json
{
  "schemaVersion": 2,
  "imageName": "nginx:stable-alpine"
}
```

The image must be accessible to the CapRover server. For a private registry, add its credentials under [Container Registries](./registries/index.md) before deploying. You can also use `caprover deploy --imageName IMAGE` from the CLI.

After deployment, set the app's container HTTP port to the port the image actually listens on, or mark a worker/database app as non-web. Verify the service and app logs. Prefer explicit tags or digests for predictable production rollouts; floating tags may resolve to a different image later.
