---
id: internal-networking
title: Internal App-to-App Networking
slug: /domains/internal-networking
---

CapRover apps on its Docker overlay network can reach one another by service name and the destination's container port. For a new app named `database`, a web app can connect to `database:5432` for PostgreSQL without a public port mapping. Put the connection host and credentials in the consumer app's environment variables.

Apps upgraded from older CapRover versions may retain physical service names with a `srv-captain--` prefix; the prefixed network alias remains available for compatibility. Check the actual service and network if name resolution fails.

This internal path is preferable for routine app-to-database traffic. Publishing a port is only necessary for an external client. See [Connect to Databases Internally](../data-persistence/internal-databases.md).
