---
id: index
title: Data & Persistence
slug: /data-persistence
---

<span id="source-data-persistence-stateless-persistent"></span>

## Stateless vs Persistent Apps

- A stateless app can be replaced or moved without losing required local data.
- A persistent app stores important files in a Docker volume or host bind mount.
- Choose **Has Persistent Data** when creating a database or an app that stores uploads locally, then explicitly configure every directory that must survive a new container.

- Persistence is per mounted path: turning on the persistent-app setting alone does not preserve arbitrary files inside the container.
- CapRover normally keeps a persistent app on a specific node and at one instance.
- The dashboard permits advanced overrides, but multiple replicas using the same local data can corrupt it unless the app and storage are designed for concurrent access.

- A web app that stores its uploads in an external object store and its records in a separate database can remain stateless.
- Back up the database and object store separately.
- See [Docker Volumes](index.md#source-data-persistence-volumes), [Bind Mounts](index.md#source-data-persistence-bind-mounts), and [Node Placement](index.md#source-data-persistence-node-placement).

<span id="source-data-persistence-volumes"></span>

## Docker Volumes

### Configure a volume

1. Open the app's persistent directories settings.
2. Choose **Docker volume** and enter a volume name.
3. Set the **container path** used by your app.
4. Save, write test data, redeploy, and verify that the data remains.

**Example:** PostgreSQL commonly uses `/var/lib/postgresql/data`. Check your image's documentation.

**Important:**

- Current CapRover versions use the volume name you enter.
- Volumes from before 1.15 may start with `captain--`. Check with `docker volume ls`.
- Local volumes remain on their Docker node. They are not replicated across Swarm nodes.
- CapRover configuration backups exclude volume contents. See [Back Up Persistent Data](backup-data.md).

### After deleting an app

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

<span id="source-data-persistence-bind-mounts"></span>

## Bind Mounts

- A bind mount maps a specific host directory into a container.
- Create the host directory on the node that will run the app, set its ownership and permissions for the container process, then enter the host path and container path in the app's persistent-directory settings.

- Example: host `/srv/app/uploads` mapped to container `/app/uploads` lets the app keep uploaded files when its container is replaced.
- Check that the host path exists before deployment.
- Use an absolute host path, and avoid mounting sensitive host directories into an untrusted app.

The path is node-local. If a task is scheduled on another server, an identical path there is not automatically the same data. Keep the app pinned to its data node or provide tested shared storage. Back up the host directory independently of CapRover configuration.

<span id="source-data-persistence-node-placement"></span>

## Node Placement

- CapRover records a node ID for a persistent app and checks that the requested node belongs to the Swarm when settings change.
- This placement keeps the app near its local volume or bind mount.
- A new node with the same path name does not have the same files.

- Before moving a persistent app, stop writes, back up its data, copy or restore it to the destination node, check permissions and volume names, then change placement and verify the app reads the expected records.
- Keep a rollback copy until the new placement is proven.

If you want multiple replicas on different nodes, design the storage and application for concurrent access. CapRover does not make node-local storage shared. See [Persistent Applications in Clusters](../scaling/multi-node.md#source-scaling-persistent-apps).

<span id="source-applications-persistent-directories"></span>

## Persistent Directories

- Persistent directories store selected container paths outside the replaceable app container.
- In the app configuration, add a Docker volume or bind mount and identify the **container path** your app actually writes to.
- Save the settings and verify the app can read and write the mounted location.

- Choose persistence when creating the app if it is stateful.
- On a multi-node cluster, a local volume or bind mount stays on its host; keep the app on the node that holds its data.
- Back up the mounted data separately from a CapRover configuration backup.

See [Docker Volumes](index.md#source-data-persistence-volumes), [Bind Mounts](index.md#source-data-persistence-bind-mounts), and [Back Up Persistent Data](backup-data.md) for storage and recovery workflows.

<span id="source-guides-persistent-storage"></span>

## Persistent Storage Recipes

For an application that writes files, find the exact container directory it uses and mount a persistent directory there before storing real data.

- Example: if an image writes uploads to `/app/uploads`, create the app, mark it persistent, add a persistent directory at `/app/uploads`, and deploy the image.
- Upload a test file, restart the service, and confirm the file remains.
- A mount at a different path does not protect those files.

- For databases, use the image's documented data directory and a database-aware backup/export method.
- Host bind mounts and Docker volumes usually live on one node; pin the service there or use [shared storage](shared-storage.md).
- Back up each volume or database separately from the [CapRover backup](../server/backup/index.md#source-server-backup-contents).
- See [Volumes](index.md#source-data-persistence-volumes) for the exact storage choices.
