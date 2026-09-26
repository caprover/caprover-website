---
id: deploy-databases
title: Deploy Databases
slug: /data-persistence/deploy-databases
---

A database on CapRover is an app that needs storage, credentials, and a network path for its clients. The [One-Click Apps](../one-click-apps/index.md) catalog can create a supported database service, or you can deploy a database image yourself.

1. Choose the database and image version. Create its app with **Has Persistent Data** enabled and leave **Do not expose as web app** selected; databases generally do not serve HTTP through NGINX.
2. Configure the database's required username, password, and database name through its app settings or One-Click installer. Use unique credentials and keep them out of source control.
3. Mount a named volume or bind path at the database image's actual data directory. Place the app on the node holding that storage.
4. Deploy and read the service logs until the database reports it is ready. Restart or redeploy once to confirm its data remains present.
5. Connect another app by the database service name and internal container port. Publish a host port only if an external client needs it; follow the [external connection guide](./external-databases.md) for its firewall and security steps.
6. Schedule database-aware backups and test a restore. The CapRover configuration backup does not contain the database records.

Check the chosen database image's storage path and initialization variables; they differ between PostgreSQL, MySQL, Redis, and other services.
