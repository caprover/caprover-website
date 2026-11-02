---
id: production-checklist
title: Production Checklist
slug: /production-checklist
---

Before hosting important applications, check:

- **Access**
  - Change the initial password.
  - Enable dashboard HTTPS and **Force HTTPS**.
  - Restrict direct access to port `3000`.
  - Use limited credentials for automation.
- **DNS and HTTPS**
  - Verify wildcard DNS.
  - Check dashboard and app certificates.
  - Plan DNS changes for future server moves.
- **Data**
  - Use volumes or bind mounts for persistent data.
  - Back up databases, uploads, and other app data separately.
  - Keep node placement in mind for local storage.
- **Recovery**
  - Store CapRover configuration backups off-server.
  - Test an app-data restore.
  - Record image locations, node placement, and registry access.
- **Capacity**
  - Leave CPU, RAM, and disk headroom for builds.
  - Monitor disk usage.
  - Choose an image cleanup policy that preserves useful rollbacks.
- **Networking**
  - Open only necessary public ports.
  - Restrict Swarm inter-node ports to trusted nodes.
  - Review each published TCP/UDP app port. Docker-published ports can bypass simple UFW rules.
- **Upgrades**
  - Test deployments and upgrades against your applications.
  - Keep a recoverable backup.
  - Configure health checks for your availability needs.

Start with [Getting Started](./get-started.md). For ongoing maintenance, see [Server Administration](./server/index.md).
