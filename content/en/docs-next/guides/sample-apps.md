---
id: sample-apps
title: Sample Applications
slug: /guides/sample-apps
---

The [CapRover sample applications](https://github.com/caprover/caprover/tree/master/captain-sample-apps) demonstrate Dockerfiles and Captain Definitions for several frameworks.

1. Pick a sample and inspect its `captain-definition`, Dockerfile, exposed container port, and required environment variables.
2. Create a disposable app in the dashboard.
3. Choose one deployment method: package the sample's deployment files into a tar archive and upload it from the app's **Deployment** tab, **or** commit the sample to a Git branch and deploy it with the [CLI](../deployments/cli.md). The CLI's normal Git mode excludes uncommitted and ignored files.
4. Watch build logs. If the container listens on a port other than CapRover's default, set the app's container HTTP port accordingly. Check the app URL over HTTP and then HTTPS.

Treat sample credentials and sample data as examples only. Before production use, set real secrets, add persistence where needed, and plan [backups](../server/backup/index.md).
