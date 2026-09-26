---
id: cli
title: CLI Commands
slug: /reference/cli
---

The [CapRover CLI](https://github.com/caprover/caprover-cli) runs on your workstation. The common workflow is:

```bash
npm install -g caprover
caprover serversetup
caprover deploy
```

`serversetup` configures an initial server; `deploy` uploads the selected project's source/archive and deploys it to an app. Run `caprover --help` and `caprover deploy --help` for the commands and flags supported by your installed CLI version. Store server credentials securely; avoid putting them in a committed configuration file. See [CLI Deployment](../deployments/cli.md) for a task walkthrough.
