---
id: move-server
title: Move CapRover to Another Server
slug: /server/move-server
---

Use [Create a Backup](./backup/create.md) on the source and back up every application's volumes, databases, and uploaded files separately. Record the root domain, DNS records, registry location, custom ports, and each app's node placement.

Provision the destination with Docker and the necessary ports. [Restore the CapRover archive](./backup/restore.md), or use [Multi-Node Restore](./backup/multi-node-restore.md) for a cluster. Restore application data, confirm images are accessible or redeploy them, and test the dashboard and apps. Change the wildcard and dashboard DNS records to the new address when ready; check HTTPS after DNS propagates. Keep the old host available until the new one has passed a restore check.
