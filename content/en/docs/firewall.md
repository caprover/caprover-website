---
id: firewall
title: Firewall & Port Forwarding
sidebar_label: Firewall & Port Forwarding
---

## Public ports

Expose these ports to users:

- `80/tcp` for HTTP
- `443/tcp` for HTTPS
- `443/udp` for HTTP/3
- `3000/tcp` for initial setup. You can close it after CapRover is attached to a domain.

For a single-node Ubuntu server using UFW:

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw allow 3000/tcp
```

Port `996/tcp` is used by CapRover's Docker registry. Expose it only when an external client must connect to the self-hosted registry.

## Cluster ports

In a multi-node cluster, allow the following ports only between trusted Swarm nodes:

- `2377/tcp` for Swarm management traffic
- `7946/tcp` and `7946/udp` for node communication
- `4789/udp` for overlay network traffic

Restrict `4789/udp` to trusted nodes. Exposing the VXLAN port publicly can make the overlay network vulnerable.

If you add a port mapping to an app, allow that application port through your provider firewall as needed. Docker-published ports can bypass UFW rules, so configure Docker-aware firewall rules when access must be restricted. See Docker's documentation on [packet filtering and firewalls](https://docs.docker.com/engine/network/packet-filtering-firewalls/).
