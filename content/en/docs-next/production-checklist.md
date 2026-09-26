---
id: production-checklist
title: Production Checklist
slug: /production-checklist
---

Before putting an important application on CapRover, verify these operational basics:

- **Access:** Replace the initial dashboard password, enable dashboard HTTPS and Force HTTPS, and restrict direct access to the initial admin port `3000`. Use a separate account or limited credentials for automated source access.
- **DNS and certificates:** Confirm the wildcard DNS record resolves directly to the server. Verify the dashboard and each public app over HTTPS, then plan how DNS changes will be handled when moving servers.
- **Data:** Decide which apps need volumes or bind mounts. Keep data on the intended node and make separate backups of databases, uploads, and other persistent app data. A CapRover configuration backup does not include all app data.
- **Recovery:** Save CapRover configuration backups outside the server, test an app-data restore, and record where images are stored. For clusters, document node placement and registry availability.
- **Capacity:** Leave CPU, memory, and disk headroom for deployments. Builds can use considerably more memory than the running app. Watch disk usage and choose an image cleanup policy appropriate for your rollback needs.
- **Network exposure:** Open only the required public ports. Limit Swarm's inter-node ports to trusted nodes and review every public TCP/UDP app port separately. Docker-published ports may bypass simple UFW rules.
- **Updates:** Test upgrades and deploys against your own applications, keep a recoverable backup, and check that health checks support the availability level you need.

Use [Getting Started](./get-started.md) for the first installation and [Server Administration](./server/index.md) for ongoing operations. This checklist is an entry point; the detailed procedures live with each product area.
