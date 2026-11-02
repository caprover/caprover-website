---
id: ports
title: Network and Firewall Ports
slug: /reference/ports
---

| Port | Protocol | Purpose |
| --- | --- | --- |
| 80 | TCP | HTTP and certificate validation |
| 443 | TCP | HTTPS |
| 3000 | TCP | Initial dashboard setup |
| 996 | TCP | Self-hosted registry, if enabled |
| 22 | TCP | SSH, or your configured SSH port |
| 2377 | TCP | Swarm management |
| 7946 | TCP/UDP | Swarm node communication |
| 4789 | UDP | Swarm overlay traffic |

- Only SSH, 80, 443, and 3000 are relevant to initial single-node setup.
- Restrict Swarm ports to trusted cluster nodes and 3000 after dashboard HTTPS setup.
- App-specific published TCP/UDP ports require their own access rules.
- Custom host ports: `CAPTAIN_HOST_HTTP_PORT`, `CAPTAIN_HOST_HTTPS_PORT`, and `CAPTAIN_HOST_ADMIN_PORT`. See [Server Environment](server-environment.md).
