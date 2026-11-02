---
id: restore
title: Restore a Server
slug: /server/backup/restore
---

## Before restoring

- **Server:** Fresh host with Docker, SSH, and enough disk for the archive and extracted data
- **Firewall:** SSH, `80/tcp`, `443/tcp`, and `3000/tcp` open during setup
- **Clusters:** Prepare trusted [Swarm and registry ports](../../reference/ports.md)
- **Data:** Read [What Is Backed Up](./contents.md) and obtain separate database and volume backups

**Important:** Place the archive at `/captain/backup.tar` **before** running the CapRover installer. The installer detects it at startup.

## Restore

1. Copy the archive to the new server:

   ```bash
   ssh root@NEW_IP 'mkdir -p /captain'
   scp backup.tar root@NEW_IP:/captain/backup.tar
   ```

2. Run CapRover on the new server:

   ```bash
   sudo docker run -p 80:80 -p 443:443 -p 3000:3000 \
     -e ACCEPTED_TERMS=true \
     -v /var/run/docker.sock:/var/run/docker.sock \
     -v /captain:/captain \
     caprover/caprover
   ```

   Need Docker? Follow [Getting Started](../../get-started.md) first.

3. Watch the installer logs. For clusters, follow [Multi-Node Restore](./multi-node-restore.md) when prompted for node mapping.
4. Point the original wildcard DNS to the new server when ready. For a clone running alongside the original, choose a different root domain.
5. Restore database files, volumes, and bind mounts separately. Redeploy apps if their images are missing.
6. Verify dashboard access, HTTPS, services, and application data before fully switching traffic.

Keep the original server and backups until verification succeeds.
