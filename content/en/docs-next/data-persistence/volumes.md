---
id: volumes
title: Docker Volumes
slug: /data-persistence/volumes
---

## Configure a volume

1. Open the app's persistent directories settings.
2. Choose **Docker volume** and enter a volume name.
3. Set the **container path** used by your app.
4. Save, write test data, redeploy, and verify that the data remains.

**Example:** PostgreSQL commonly uses `/var/lib/postgresql/data`. Check your image's documentation.

**Important:**

- Current CapRover versions use the volume name you enter.
- Volumes from before 1.15 may start with `captain--`. Check with `docker volume ls`.
- Local volumes remain on their Docker node. They are not replicated across Swarm nodes.
- CapRover configuration backups exclude volume contents. See [Back Up Persistent Data](./backup-data.md).

## After deleting an app

Docker volumes may remain after app deletion.

1. On the app's node, inspect the volume:

   ```bash
   docker volume ls
   docker volume inspect VOLUME_NAME
   docker ps -a --filter volume=VOLUME_NAME
   ```

2. Confirm the volume belongs to the deleted app and is unused elsewhere.
3. Back up its data off-host if needed.
4. To permanently delete it, run `docker volume rm VOLUME_NAME` on that node.

An in-use volume cannot be removed. Avoid `docker volume prune` on shared hosts: it can remove unrelated unused volumes.
