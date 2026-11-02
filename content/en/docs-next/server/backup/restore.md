---
id: restore
title: Restore a Server
slug: /server/backup/restore
---

## Before restoring

- **Server:** Fresh host with Docker, SSH, and enough disk for the archive and extracted data
- **Firewall:** SSH, `80/tcp`, `443/tcp`, and `3000/tcp` open during setup
- **Clusters:** Prepare trusted [Swarm and registry ports](../../reference/ports.md)
- **Data:** Read [What Is Backed Up](index.md#source-server-backup-contents) and obtain separate database and volume backups

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

3. Watch the installer logs. For clusters, follow [Multi-Node Restore](restore.md#source-server-backup-multi-node-restore) when prompted for node mapping.
4. Point the original wildcard DNS to the new server when ready. For a clone running alongside the original, choose a different root domain.
5. Restore database files, volumes, and bind mounts separately. Redeploy apps if their images are missing.
6. Verify dashboard access, HTTPS, services, and application data before fully switching traffic.

Keep the original server and backups until verification succeeds.

<span id="source-server-backup-multi-node-restore"></span>

## Multi-Node Restore

Prepare the new manager and each replacement worker with Docker, network access, and a plan for the old nodes' persistent data. Follow [Restore a Server](restore.md) on the new manager.

- For a multi-node backup, the first installer run can exit intentionally and create `/captain/restoring/restore-instructions.json`.
- Inspect its `oldNodesForReference` and `nodesMapping`.
- For each old worker, replace the placeholder `newIp` with its replacement node IP.
- Leave the manager's `CURRENT_NODE_DONT_CHANGE` mapping alone.
- The file also supplies the SSH `user` and `privateKeyPath` for each worker; configure access and copy the required private key securely to the indicated path (by default `/captain/id_rsa`).

- Rerun the **same** installation command on the new manager.
- The installer checks SSH to workers and maps saved node placement to the replacements.
- Remove the copied private key after restoration.
- Restore each node's volumes and bind mounts separately, verify registry access and redeploy unavailable images, then inspect placement and services.
- Never point production DNS at the new cluster until validation is complete.

<span id="source-server-move-server"></span>

## Move CapRover to Another Server

- Use [Create a Backup](index.md#source-server-backup-create) on the source and back up every application's volumes, databases, and uploaded files separately.
- Record the root domain, DNS records, registry location, custom ports, and each app's node placement.

- Provision the destination with Docker and the necessary ports. [Restore the CapRover archive](restore.md), or use [Multi-Node Restore](restore.md#source-server-backup-multi-node-restore) for a cluster.
- Restore application data, confirm images are accessible or redeploy them, and test the dashboard and apps.
- Change the wildcard and dashboard DNS records to the new address when ready; check HTTPS after DNS propagates.
- Keep the old host available until the new one has passed a restore check.
