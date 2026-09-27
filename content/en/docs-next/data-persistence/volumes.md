---
id: volumes
title: Docker Volumes
slug: /data-persistence/volumes
---

Use a Docker named volume when CapRover should manage the storage location. In the app configuration, add a persistent directory, choose the volume option, supply a volume name, and set the **container path** where the app writes its data. For PostgreSQL, a typical container data path is `/var/lib/postgresql/data`, but confirm it against the image you deploy.

Current CapRover versions use the volume name you enter. Volumes retained from pre-1.15 installs may have a `captain--` prefix; run `docker volume ls` to identify the actual name before a backup or migration. The local volume's data lives on its Docker node and is not automatically copied to other Swarm nodes.

Verify persistence by writing representative data, redeploying the app, and reading the data again. A CapRover configuration backup does not contain the volume's files. Use [Back Up Persistent Data](./backup-data.md) for a separate backup and restore plan.

## After deleting a stateful app

Deleting its CapRover app does not mean you have backed up or intentionally discarded its Docker volume. On the node where the app ran, inspect `docker volume ls`, `docker volume inspect VOLUME_NAME`, and `docker ps -a --filter volume=VOLUME_NAME`. Confirm no other service uses that exact volume, take an off-host backup if the data matters, and check the name against your app's recorded mount. When you have decided to destroy that volume, run `docker volume rm VOLUME_NAME` on the node that owns it. An in-use volume cannot be removed. Avoid `docker volume prune` on a shared host because it can remove other unused volumes you meant to keep.
