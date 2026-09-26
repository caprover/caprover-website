---
id: backup-contents
title: Backup Contents
slug: /reference/backup-contents
---

The [backup implementation](https://github.com/caprover/caprover/blob/master/src/user/system/BackupManager.ts) archives `/captain/data` and adds `meta/backup.json` with the CapRover salt and cluster node metadata.

| Included | Excluded unless stored inside `/captain/data` |
| --- | --- |
| Saved CapRover configuration, app definitions, certificates, and self hosted registry data under `/captain/data/registry`. | Docker volumes and host bind mounts elsewhere, database files there, and local Docker image store. |

The registry exception can make archives large. The restore code looks for `/captain/backup.tar` at initial installation and expands it into `/captain/restoring`. See [What Is Backed Up](../server/backup/contents.md) and [Restore a Server](../server/backup/restore.md) for the full recovery sequence.
