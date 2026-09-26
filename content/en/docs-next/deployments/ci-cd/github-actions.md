---
id: github-actions
title: GitHub Actions
slug: /deployments/ci-cd/github-actions
---

Create a CapRover app and enable its [deployment token](./deployment-tokens.md). In your GitHub repository, add `CAPROVER_APP_TOKEN` as an Actions secret. Add a `captain-definition` file for source deployments.

For a small source build on the CapRover server, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to CapRover
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: caprover/deploy-from-github@v2
        with:
          server: https://captain.apps.example.com
          app: my-app
          token: ${{ secrets.CAPROVER_APP_TOKEN }}
```

Replace the server URL and app name. The action packages committed files from the checked-out commit; a generated or uncommitted file requires its `tar-file` input. For heavy builds, build and push an image in Actions and pass its name through the action's `image` input. If the image is private, [configure registry credentials on CapRover](../registries/private.md) as well as on the runner.

Review the [action's current inputs and image example](https://github.com/caprover/deploy-from-github) before adapting this workflow. An accepted token deployment can finish asynchronously; verify the resulting CapRover build and app health separately.
