---
id: sample-apps
title: Sample Applications
slug: /guides/sample-apps
---

The [CapRover sample applications](https://github.com/caprover/caprover/tree/master/captain-sample-apps) demonstrate Dockerfiles and Captain Definitions for several frameworks.

1. Pick a sample and inspect its `captain-definition`, Dockerfile, exposed container port, and required environment variables.
2. Create a disposable app in the dashboard.
3. Package the sample's deployment files into a tar archive, or deploy its source with the [CLI](../deployments/cli.md), then open the app's Deployment page and upload the archive.
4. Watch build logs. If the container listens on a port other than CapRover's default, set the app's container HTTP port accordingly. Check the app URL over HTTP and then HTTPS.

Treat sample credentials and sample data as examples only. Before production use, set real secrets, add persistence where needed, and plan [backups](../server/backup/index.md).
