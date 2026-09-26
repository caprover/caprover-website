---
id: cli
title: Deploy with the CLI
slug: /deployments/cli
---

Install the CapRover CLI on your development machine with `npm install -g caprover`. Set up the server first, create an app in its dashboard, and sign in to the HTTPS dashboard URL:

```bash
caprover login
```

In the root of a Git project, add a `captain-definition` file. For a repository Dockerfile:

```json
{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}
```

Run `caprover deploy` from that project directory and choose the saved server, app, and branch at the prompts. The CLI uploads the committed Git content, starts a build, and reports progress. Uncommitted and Git-ignored files are not included. After the first successful run, `caprover deploy -d` reuses the saved choices for that directory.

For a prebuilt image, use `caprover deploy --imageName IMAGE` and provide the app/server information when prompted. Keep credentials out of shell history and CI logs; [deployment tokens](./ci-cd/deployment-tokens.md) are better for app-scoped automation. See the complete [CLI command reference](../reference/cli.md).
