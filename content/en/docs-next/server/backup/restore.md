---
id: restore
title: Restore a Server
slug: /server/backup/restore
---

Restore to a fresh server with Docker installed, enough disk for the archive and its extracted data, and SSH access. Permit inbound `80/tcp`, `443/tcp`, and `3000/tcp` for initial setup in both provider and host firewalls; keep SSH open. For a cluster, also prepare the trusted [Swarm and registry ports](../../reference/ports.md) between nodes. **Do not run the usual CapRover installation container before placing the archive**: the installer detects `/captain/backup.tar` at startup. First read [What Is Backed Up](./contents.md) and obtain separate backups for databases and persistent volumes.

1. Copy the selected archive to the new host and name it `/captain/backup.tar` (for example, `ssh root@NEW_IP 'mkdir -p /captain'` then `scp backup.tar root@NEW_IP:/captain/backup.tar`).
2. On the new host, run this installation command **after** copying the archive:

   ```bash
   sudo docker run -p 80:80 -p 443:443 -p 3000:3000 \
     -e ACCEPTED_TERMS=true \
     -v /var/run/docker.sock:/var/run/docker.sock \
     -v /captain:/captain \
     caprover/caprover
   ```

   If Docker is not yet installed, complete the Docker installation and verification section of [Getting Started](../../get-started.md) first.
3. Watch the installer output. For a cluster, follow [Multi-Node Restore](./multi-node-restore.md) when the first run requests node mapping.
4. Point the original root domain and wildcard DNS at the new server when ready for traffic. If this is a clone that will keep the old server online, plan a distinct root domain first.
5. Restore application data to its volumes and bind mounts using each application's recovery procedure. Redeploy apps if their images are unavailable. Check the dashboard, HTTPS, services, and application data before moving traffic fully.

Keep the source server and its backups available until validation completes. Do not assume restored configuration means an application has its data or image.
