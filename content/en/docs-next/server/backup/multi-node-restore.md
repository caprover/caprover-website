---
id: multi-node-restore
title: Multi-Node Restore
slug: /server/backup/multi-node-restore
---

Prepare the new manager and each replacement worker with Docker, network access, and a plan for the old nodes' persistent data. Follow [Restore a Server](./restore.md) on the new manager.

For a multi-node backup, the first installer run can exit intentionally and create `/captain/restoring/restore-instructions.json`. Inspect its `oldNodesForReference` and `nodesMapping`. For each old worker, replace the placeholder `newIp` with its replacement node IP. Leave the manager's `CURRENT_NODE_DONT_CHANGE` mapping alone. The file also supplies the SSH `user` and `privateKeyPath` for each worker; configure access and copy the required private key securely to the indicated path (by default `/captain/id_rsa`).

Rerun the **same** installation command on the new manager. The installer checks SSH to workers and maps saved node placement to the replacements. Remove the copied private key after restoration. Restore each node's volumes and bind mounts separately, verify registry access and redeploy unavailable images, then inspect placement and services. Never point production DNS at the new cluster until validation is complete.
