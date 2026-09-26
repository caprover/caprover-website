---
id: ports
title: Network and Firewall Ports
slug: /reference/ports
---

The [default installation](../get-started.md) publishes TCP ports 80, 443, and 3000. Other ports apply only when the corresponding feature or host service is enabled:

| Port | Protocol | Use |
| --- | --- | --- |
| 80 | TCP | HTTP and certificate challenges. |
| 443 | TCP | HTTPS. |
| 443 | UDP | HTTP/3 when enabled; allow through the firewall when used. |
| 3000 | TCP | Initial admin dashboard; restrict public access after dashboard HTTPS is working. |
| 996 | TCP | Self hosted registry when enabled; allow intended registry clients and cluster nodes. |
| 22 | TCP | Host SSH administration and CapRover's SSH access to added nodes; your host may use a different SSH port. |

For a multi-node Docker Swarm, nodes also need trusted private connectivity for Swarm management (`2377/tcp`), node discovery (`7946/tcp,udp`), overlay traffic (`4789/udp`), and SSH (`22/tcp` or your configured port) from the manager to added nodes. Restrict these to cluster nodes and check [cluster networking](../scaling/networking.md) for provider firewall considerations. Expose additional app ports only when the application requires them. `CAPTAIN_HOST_HTTP_PORT`, `CAPTAIN_HOST_HTTPS_PORT`, and `CAPTAIN_HOST_ADMIN_PORT` alter the published host mappings; see [Server Environment](./server-environment.md).
