---
id: backup-data
title: Back Up Persistent Data
slug: /data-persistence/backup-data
---

A CapRover backup captures CapRover state and configuration, **not** the contents of every app volume, host directory, or external database. Plan app-data backups by workload.

1. Inventory the app's volume names, bind paths, database service, and external storage. Use `docker volume ls` to confirm physical names; old installs may have `captain--` prefixes.
2. For databases, use the database's supported consistent dump or snapshot procedure. For uploaded files, back up the mounted directory or object store using a method that handles concurrent writes appropriately.
3. Store copies outside the server, protect them as sensitive, and define retention and encryption.
4. Restore into a test app or test server and verify real records and files. Record the matching app/image and database versions required for recovery.

Back up CapRover's configuration as a separate step through [Backup & Restore CapRover](../server/backup/index.md). A usable disaster-recovery plan needs both sides and the registry images needed to run the apps.

<span id="source-data-persistence-move-data"></span>

## Move Persistent Data

- Moving a persistent app requires moving its data as well as updating its CapRover settings.
- First identify the actual volume or bind path and the source node.
- Back it up, then stop writes or put the app into maintenance mode so the copy is consistent.

- Create the destination path or volume on the new node, transfer or restore data, and check ownership and permissions for the container user.
- Update the app's node placement and storage settings only after the destination is ready.
- Start one instance, verify expected records or files, and keep the source backup until recovery has been tested.

- For a database, prefer its supported migration or dump/restore process rather than copying live data files.
- When moving the whole server, use [Move CapRover to Another Server](../server/backup/restore.md) for the control-plane steps as well.
