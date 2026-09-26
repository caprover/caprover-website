---
id: connect
title: Connect One-Click Services
slug: /one-click-apps/connect
---

One-Click services are CapRover apps on its Docker network. Another app can normally connect by the service's app name and internal container port, such as `postgres:5432`, without exposing a database port publicly. Store its connection credentials in the consumer app's configuration.

Confirm the installed template's actual app name and listen port. For legacy apps, a `srv-captain--` network alias may remain available. Verify a query or health check from the consumer, then back up the database's volume.

For a client outside CapRover, follow [Connect to Databases Externally](../data-persistence/external-databases.md). That workflow includes the port mapping, firewall restrictions, and transport security a public connection requires.
