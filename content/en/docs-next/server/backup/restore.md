---
id: restore
title: Restore a Server
slug: /server/backup/restore
---

Restore to a prepared server with Docker installed and the required DNS and firewall access. **Do not run the usual CapRover installation container before placing the archive**: the installer detects `/captain/backup.tar` at startup. First read [What Is Backed Up](./contents.md) and obtain separate backups for databases and persistent volumes.

1. Copy the selected archive to the new host and name it `/captain/backup.tar` (for example, `ssh root@NEW_IP 'mkdir -p /captain'` then `scp backup.tar root@NEW_IP:/captain/backup.tar`).
2. On that host, run the normal CapRover Docker installation command from [Getting Started](../../get-started.md), with the Docker socket and `/captain:/captain` mount. Do this only after copying the archive.
3. Watch the installer output. For a cluster, follow [Multi-Node Restore](./multi-node-restore.md) when the first run requests node mapping.
4. Point the original root domain and wildcard DNS at the new server when ready for traffic. If this is a clone that will keep the old server online, plan a distinct root domain first.
5. Restore application data to its volumes and bind mounts using each application's recovery procedure. Redeploy apps if their images are unavailable. Check the dashboard, HTTPS, services, and application data before moving traffic fully.

Keep the source server and its backups available until validation completes. Do not assume restored configuration means an application has its data or image.
