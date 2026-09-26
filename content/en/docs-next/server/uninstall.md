---
id: uninstall
title: Uninstall CapRover
slug: /server/uninstall
---

Before removing CapRover, export a [CapRover backup](./backup/create.md) and separate backups for every application's data. Record DNS and image registry dependencies. Removing CapRover or its Docker resources can make applications unavailable.

If you are retiring a host, first move or delete applications through the dashboard and confirm where their data lives. Remove the CapRover service and any remaining Docker services only after checking their names and dependencies with `docker service ls`. Review `/captain`, Docker volumes, images, network rules, and DNS separately; delete only resources you have identified as no longer needed. Keep a tested restore copy before destroying the server.
