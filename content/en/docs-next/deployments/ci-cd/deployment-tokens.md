---
id: deployment-tokens
title: Deployment Tokens
slug: /deployments/ci-cd/deployment-tokens
---

An app deployment token lets automation deploy one CapRover app without using the dashboard password. Create the app, open its **Deployment** tab, enable the app token, and copy the value into your CI system's secret store. Treat both the token and any Git webhook URL as credentials.

Use the HTTPS dashboard URL and the exact app name in CI. For the CLI, supply `--appToken` or set `CAPROVER_APP_TOKEN` in the process environment, together with the server URL and app name. The community [GitHub deployment action](./github-actions.md) accepts the token as its `token` input.

If the token is exposed, replace or disable it in the app settings and update your CI secret. Give each deployment job only the registry credentials it also needs; an app token does not grant the CapRover server access to a private image registry.
