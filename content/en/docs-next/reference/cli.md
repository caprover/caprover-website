---
id: cli
title: CLI Commands
slug: /reference/cli
---

The [CapRover CLI](https://github.com/caprover/caprover-cli) runs on your workstation. Install it with `npm install -g caprover` and use these commands:

| Command | Purpose |
| --- | --- |
| `caprover serversetup` | Initialize a new server and its root domain. |
| `caprover login` | Store a server login locally. |
| `caprover list` | Show logged-in servers. |
| `caprover deploy` | Deploy a Git branch, tar archive, or image. |
| `caprover logout` | Remove a stored server login. |
| `caprover api` | Call the CapRover API through the CLI. |

For `deploy`, select **one** input: `-b, --branch` archives the committed branch from the Git repository; `-t, --tarFile` uploads an existing archive, including files generated locally; `-i, --imageName` deploys an existing image. `-d, --default` reuses saved choices. Use `-u, --caproverUrl` and `-a, --caproverApp` to specify the server and app, with `--appToken` (or `CAPROVER_APP_TOKEN`) for app-scoped deployment. Other options include `-n, --caproverName`, `-p, --caproverPassword`, and `-c, --configFile`.

For example, to deploy a locally built archive with an app token:

```bash
caprover deploy -u https://captain.apps.example.com -a my-app \
  --appToken "$CAPROVER_APP_TOKEN" -t ./deploy.tar
```

The default Git mode excludes uncommitted and Git-ignored files. Run `caprover deploy --help` for the exact options supported by your installed version. Store server credentials securely; avoid putting them in a committed configuration file. See [CLI Deployment](../deployments/cli.md) for a walkthrough.
