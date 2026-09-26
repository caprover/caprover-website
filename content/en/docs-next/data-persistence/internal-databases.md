---
id: internal-databases
title: Connect to Databases Internally
slug: /data-persistence/internal-databases
---

Apps on CapRover's overlay network can connect to a database service by its app name and container port. For a PostgreSQL app named `postgres`, use host `postgres` and port `5432` in the client app, along with the database's configured name, username, and password.

For example, set the web app's `DATABASE_URL` to a connection string appropriate for its driver. Save the web app settings and test a query. No public port mapping is needed. Apps upgraded from before CapRover 1.15 may retain a `srv-captain--` service name and network alias; inspect the actual service if a hostname fails to resolve.

Keep credentials in app environment settings or a suitable secret mechanism, and make sure the database app has persistent storage and backups. See [Deploy Databases](./deploy-databases.md) first if the database is not yet installed.
