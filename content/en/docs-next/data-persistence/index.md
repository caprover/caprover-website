---
id: index
title: Persistent Storage
slug: /data-persistence
---

<span id="source-data-persistence-stateless-persistent"></span>

## When to use persistence

- Use **Has Persistent Data** for databases and apps that store local uploads.
- Only configured mount paths survive container replacement. The persistent-app flag alone does not save arbitrary container files.
- Stateless web apps can use external databases or object storage.

<span id="source-data-persistence-volumes"></span>

## Docker volumes

- Set a **volume name** and the container path the app writes to.
- PostgreSQL commonly uses `/var/lib/postgresql/data`; verify the path for your image.
- Current CapRover versions use the volume name you enter. Older volumes (before 1.15) may use a `captain--` prefix; check with `docker volume ls`.

To inspect an orphaned volume after app deletion:

```bash
docker volume ls
docker volume inspect VOLUME_NAME
docker ps -a --filter volume=VOLUME_NAME
```

Only after confirming ownership, non-use and backup, delete with `docker volume rm VOLUME_NAME`. Avoid broad `docker volume prune` on shared hosts.

<span id="source-data-persistence-bind-mounts"></span>

## Bind mounts

- Map an absolute host directory to the container path, such as `/srv/app/uploads` → `/app/uploads`.
- Create the host path and set permissions for the container user.
- Avoid exposing sensitive host directories to untrusted containers.

<span id="source-applications-persistent-directories"></span>

## Persistent directories

- Configure mounted paths in the app's **Persistent Directories** settings.
- Verify the running app writes to the **container path** you mounted.
- Back up the mounted data separately from a CapRover configuration backup.

<span id="source-data-persistence-node-placement"></span>

## Node placement

- Named volumes and bind mounts are typically **node-local**.
- CapRover pins persistent apps to the node holding their data. Identical directory names on different nodes do not imply shared content.
- When moving a persistent app: stop writes, back up, migrate data, verify permissions, change placement, then validate the restored data.

<span id="source-guides-persistent-storage"></span>

## Storage test

Write a representative file into the mounted path, redeploy the app, and verify it remains. For databases, use a database-aware export/backup.

For shared storage across nodes, see [Shared Storage](shared-storage.md). For backups and migrations, see [Backup Persistent Data](backup-data.md).
