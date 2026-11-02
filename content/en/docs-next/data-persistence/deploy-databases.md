---
id: deploy-databases
title: Deploy Databases
slug: /data-persistence/deploy-databases
---

- A database on CapRover is an app that needs storage, credentials, and a network path for its clients.
- The [One-Click Apps](../one-click-apps/index.md) catalog can create a supported database service, or you can deploy a database image yourself.

1. Choose the database and image version. Create its app with **Has Persistent Data** enabled and leave **Do not expose as web app** selected; databases generally do not serve HTTP through NGINX.
2. Configure the database's required username, password, and database name through its app settings or One-Click installer. Use unique credentials and keep them out of source control.
3. Mount a named volume or bind path at the database image's actual data directory. Place the app on the node holding that storage.
4. Deploy and read the service logs until the database reports it is ready. Restart or redeploy once to confirm its data remains present.
5. Connect another app by the database service name and internal container port. Publish a host port only if an external client needs it; follow the [external connection guide](deploy-databases.md#source-data-persistence-external-databases) for its firewall and security steps.
6. Schedule database-aware backups and test a restore. The CapRover configuration backup does not contain the database records.

Check the chosen database image's storage path and initialization variables; they differ between PostgreSQL, MySQL, Redis, and other services.

<span id="source-data-persistence-internal-databases"></span>

## Connect to Databases Internally

- Apps on CapRover's overlay network can connect to a database service by its app name and container port.
- For a PostgreSQL app named `postgres`, use host `postgres` and port `5432` in the client app, along with the database's configured name, username, and password.

- Example: set the web app's `DATABASE_URL` to a connection string appropriate for its driver.
- Save the web app settings and test a query.
- No public port mapping is needed.
- Apps upgraded from before CapRover 1.15 may retain a `srv-captain--` service name and network alias; inspect the actual service if a hostname fails to resolve.

- Keep credentials in app environment settings or a suitable secret mechanism, and make sure the database app has persistent storage and backups.
- See [Deploy Databases](deploy-databases.md) first if the database is not yet installed.

<span id="source-data-persistence-external-databases"></span>

## Connect to Databases Externally

- Use an internal service connection when the client also runs on CapRover.
- For an external client, decide whether a restricted published port or a tunnel is appropriate before exposing a database to the internet.

### Prepare the database

- Deploy the database as a persistent, non-web app.
- Configure its data volume or bind mount, credentials, and database name.
- Verify it is ready in its service logs and that a CapRover app can reach it internally by app name and container port.
- Back up the database data separately from the CapRover configuration.

### Publish a restricted port

- In the database app's **App Config**, map a chosen host port, for example `12345/tcp`, to the database container's port, for example PostgreSQL `5432/tcp`.
- Save and verify the service update.
- From your client, connect to `SERVER_PUBLIC_IP:12345` with the database username and password.

- Allow inbound `12345/tcp` in your hosting provider's firewall **only from the client addresses that need it**.
- Review host rules as well: Docker-published ports can bypass ordinary UFW restrictions.
- In a cluster, choose ingress or host publish mode deliberately and verify which node answers the port.
- Use the database protocol's TLS and strong authentication when the traffic crosses an untrusted network; a port mapping alone does not encrypt it.

### Prefer a private path when possible

- A VPN or a tunnel into a service on CapRover's overlay network avoids a broadly published database port.
- Host SSH alone does not necessarily resolve or reach an app's internal Docker service name.
- A tunnel endpoint must have connectivity to that overlay network; verify its placement and access controls before relying on it.

After either method works, test from the intended external client, remove temporary broad firewall rules, and document the port, allowed clients, credentials owner, backup, and shutdown plan.
