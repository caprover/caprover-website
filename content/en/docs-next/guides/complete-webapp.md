---
id: complete-webapp
title: Complete Web Application Tutorial
slug: /guides/complete-webapp
---

This example has a public web app, a private worker, a database, and uploaded files. Plan the data paths before deploying.

1. Complete [Getting Started](../get-started.md) so the dashboard and a sample app work over HTTPS.
2. Create `web` and `worker` as separate applications. Deploy each from a Git repository, Captain Definition, or Docker image using [Deployments](../deployments/index.md). Configure each application's container HTTP port if it serves HTTP.
3. Provision a database using [One-Click Apps](../one-click-apps/index.md) or an external provider. Keep its port private. Give `web` and `worker` database credentials through their app environment settings.
4. Use the target app's internal hostname for private traffic; see [Internal Networking](../domains/internal-networking.md). Do not put database passwords in frontend code.
5. If `web` accepts uploads, mount a persistent directory at the exact path where it writes files, or use external object storage. Keep stateless services free of host-bound data so they can move between nodes.
6. Add a public domain and HTTPS only to `web`. Test web requests, worker jobs, database writes, and uploads after a restart.
7. Schedule separate [CapRover backups](../server/backup/index.md) and [application-data backups](../data-persistence/backup-data.md), then verify a restore.

Add replicas only after testing that sessions, uploads, and background jobs work with multiple instances. See [Scaling](../scaling/index.md).
