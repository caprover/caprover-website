---
id: cli
title: CLI Commands
slug: /reference/cli
---

<span id="install-cli"></span>

Install the [CapRover CLI](https://github.com/caprover/caprover-cli) on your computer:

```bash
npm install -g caprover
```

| Command | Purpose |
| --- | --- |
| `caprover serversetup` | Initialize server and root domain |
| `caprover login` | Save a server login |
| `caprover list` | List saved servers |
| `caprover deploy` | Deploy a branch, archive, or image |
| `caprover logout` | Remove a saved login |
| `caprover api` | Call the API |

## Deploy options

**Source (choose one):**

- `-b, --branch`: Committed Git branch
- `-t, --tarFile`: Local archive, including generated files
- `-i, --imageName`: Existing Docker image

**Destination and authentication:**

- `-u, --caproverUrl`: Server URL
- `-a, --caproverApp`: App name
- `--appToken` or `CAPROVER_APP_TOKEN`: App-scoped deployment token
- `-d, --default`: Reuse saved choices

Additional options: `-n, --caproverName`, `-p, --caproverPassword`, and `-c, --configFile`.

**Example: Deploy an archive**

```bash
caprover deploy -u https://captain.apps.example.com -a my-app \
  --appToken "$CAPROVER_APP_TOKEN" -t ./deploy.tar
```

- Git branch deployments exclude uncommitted and ignored files.
- Check `caprover deploy --help` for your installed version.
- Protect server credentials and keep them out of committed files.
- See [CLI Deployment](../deployments/cli.md) for the walkthrough.
