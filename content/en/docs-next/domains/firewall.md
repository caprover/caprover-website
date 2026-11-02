---
id: firewall
title: Firewall
slug: /domains/firewall
---

| Port | Access |
| --- | --- |
| `80/tcp` | Public HTTP and certificate validation |
| `443/tcp` | Public HTTPS |
| `3000/tcp` | Initial dashboard setup; restrict after HTTPS |
| `996/tcp` | Self-hosted registry, when enabled |
| `2377/tcp` | Swarm management between trusted nodes |
| `7946/tcp,udp` | Swarm node communication |
| `4789/udp` | Swarm overlay networking |

- Allow SSH before enabling UFW. Your hosting provider's firewall must also permit required traffic.
- Restrict Swarm ports to cluster nodes.
- Docker-published ports can bypass UFW rules. Use provider or Docker-aware firewall rules.

See [Getting Started](../get-started.md) and [Port Reference](../reference/ports.md).

<span id="source-domains-public-services"></span>
<span id="source-applications-public-ports"></span>

## Public TCP / UDP ports

- Publish application ports only for clients outside CapRover's Docker network.
- Specify container port, host port, and protocol in app settings.
- Docker Swarm's `ingress` mode routes across nodes; `host` mode publishes on the node running the task.
- Protect exposed databases with authentication and restricted network access.

<span id="source-domains-internal-networking"></span>

## Internal networking

Apps on CapRover's overlay network can connect using the destination service name and port, such as `database:5432`, without publishing a host port. Check the actual name with `docker service ls`; legacy services may retain the `srv-captain--` prefix.
