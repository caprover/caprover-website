---
id: ports
title: Network and Firewall Ports
slug: /reference/ports
---

The [default installation](../get-started.md) publishes these host ports:

| Port | Protocol | Use |
| --- | --- | --- |
| 80 | TCP | HTTP and certificate challenges. |
| 443 | TCP | HTTPS. |
| 443 | UDP | HTTP/3 when enabled. |
| 3000 | TCP | Initial admin dashboard; restrict public access after dashboard HTTPS is working. |
| 22 | TCP | SSH administration; your host may use a different SSH port. |

For a multi-node Docker Swarm, nodes also need trusted private connectivity for Swarm management (`2377/tcp`), node discovery (`7946/tcp,udp`), and overlay traffic (`4789/udp`). Restrict these to cluster nodes and check [cluster networking](../scaling/networking.md) for SSH and provider firewall considerations. Expose additional app ports only when the application requires them. `CAPTAIN_HOST_HTTP_PORT`, `CAPTAIN_HOST_HTTPS_PORT`, and `CAPTAIN_HOST_ADMIN_PORT` alter the published host mappings; see [Server Environment](./server-environment.md).
