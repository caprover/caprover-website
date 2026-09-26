---
id: firewall
title: Firewall
slug: /domains/firewall
---

Open the ports for the workflow you are actually using. A hosting-provider firewall can block traffic even when the guest firewall allows it. Docker-published container ports can bypass simple UFW rules; restrict those with provider rules or Docker-aware filtering.

| Port | Direction / audience | Purpose |
|---|---|---|
| `80/tcp` | Public inbound | HTTP routing and the usual Let's Encrypt HTTP challenge |
| `443/tcp` | Public inbound | HTTPS routing |
| `443/udp` | Public inbound when used | HTTP/3 |
| `3000/tcp` | Initial admin access | Initial dashboard setup; restrict after dashboard HTTPS works |
| `996/tcp` | Registry clients or cluster nodes when used | CapRover self-hosted Docker registry |
| `2377/tcp` | Trusted Swarm nodes only | Cluster management |
| `7946/tcp`, `7946/udp` | Trusted Swarm nodes only | Node communication |
| `4789/udp` | Trusted Swarm nodes only | Overlay VXLAN traffic |
| App-specific TCP/UDP mapping | Intended clients only | Direct access to a published app port |

On a single-node Ubuntu server using UFW, allow SSH before enabling it and allow `80/tcp`, `443/tcp`, `3000/tcp`, and optionally `443/udp`. See the commands in [Getting Started](../get-started.md). For a multi-node cluster, permit Swarm ports between nodes on trusted addresses and do not expose the VXLAN port broadly. A mapped database port requires a separate deliberate rule.

The [Network and Firewall Ports reference](../reference/ports.md) records the port roles and their scope. Check Docker's [packet-filtering documentation](https://docs.docker.com/engine/network/packet-filtering-firewalls/) before relying on UFW to restrict a Docker-published port.
