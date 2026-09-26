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
