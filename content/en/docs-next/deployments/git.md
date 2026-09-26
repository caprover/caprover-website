---
id: git
title: Deploy from Git
slug: /deployments/git
---

CapRover can pull a configured repository branch and deploy it when its webhook is triggered. Put a `captain-definition` file in the repository, create an app, then enter the repository address, branch, and credentials in the app's deployment settings. Use a read-only deploy key or a limited service account for a private repository.

Save the repository configuration and copy the generated app webhook URL into your Git provider's push webhook settings. A push event calls CapRover, which fetches the configured branch and builds the app. Protect the webhook URL as a credential. Verify a push triggers a build and check its logs before relying on automation.

The repository URL format, SSH-key requirements, and provider webhook screens can vary. The current implementation accepts the repository configuration stored with the app. For repeatable release artifacts and to keep heavy builds off the CapRover server, use [CI/CD](./ci-cd/index.md) to build an image first.
