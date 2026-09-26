---
id: generic
title: Generic CI
slug: /deployments/ci-cd/generic
---

Any CI system can deploy to CapRover if it can reach the dashboard over HTTPS and hold an app [deployment token](./deployment-tokens.md). Choose either a source archive containing `captain-definition` or a prebuilt image accessible to the server.

The simplest repeatable release flow is: build an image, tag it with an immutable commit or release identifier, push it to a registry, authorize CapRover to pull it, then deploy that exact image using the CLI or API. Keep the app token and registry credential in the CI secret store, avoid printing them in logs, and verify final app health after CapRover accepts the deployment.

If CI sends source instead, the CapRover server performs the build and needs enough memory and disk. See [Builds and Build Logs](../builds-logs.md) for troubleshooting.
