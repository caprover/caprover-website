---
id: dashboard
title: Deploy from the Dashboard
slug: /deployments/dashboard
---

Create an app in **Apps**, open its **Deployment** tab, and choose the input appropriate for your project. To deploy an archive, package the project with its `captain-definition` file at the expected path and upload the tar file. The dashboard also accepts a Captain Definition pasted into its text input when no source files are needed.

For example, paste this definition to deploy an existing public image:

```json
{"schemaVersion":2,"imageName":"nginx:stable-alpine"}
```

Start the deployment, watch the build or pull status, then verify the app's container HTTP port and its default domain. For a private image, configure registry credentials first. See [Deploy a Docker Image](./docker-image.md).
