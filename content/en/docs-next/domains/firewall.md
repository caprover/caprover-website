---
id: firewall
title: Firewall
slug: /domains/firewall
---

- Open the ports for the workflow you are actually using.
- A hosting-provider firewall can block traffic even when the guest firewall allows it.
- Docker-published container ports can bypass simple UFW rules; restrict those with provider rules or Docker-aware filtering.

| Port | Direction / audience | Purpose |
|---|---|---|
| `80/tcp` | Public inbound | HTTP routing and the usual Let's Encrypt HTTP challenge |
| `443/tcp` | Public inbound | HTTPS routing |
| `443/udp` | Optional, custom configuration only | Published by CapRover's NGINX service, but the stock templates have no QUIC listener. Opening the firewall does not enable HTTP/3. |
| `3000/tcp` | Initial admin access | Initial dashboard setup; restrict after dashboard HTTPS works |
| `996/tcp` | Registry clients or cluster nodes when used | CapRover self-hosted Docker registry |
| `2377/tcp` | Trusted Swarm nodes only | Cluster management |
| `7946/tcp`, `7946/udp` | Trusted Swarm nodes only | Node communication |
| `4789/udp` | Trusted Swarm nodes only | Overlay VXLAN traffic |
| App-specific TCP/UDP mapping | Intended clients only | Direct access to a published app port |

- On a single-node Ubuntu server using UFW, allow SSH before enabling it and allow `80/tcp`, `443/tcp`, `3000/tcp`, and optionally `443/udp`.
- See the commands in [Getting Started](../get-started.md).
- For a multi-node cluster, permit Swarm ports between nodes on trusted addresses and do not expose the VXLAN port broadly.
- A mapped database port requires a separate deliberate rule.

The [Network and Firewall Ports reference](../reference/ports.md) records the port roles and their scope. Check Docker's [packet-filtering documentation](https://docs.docker.com/engine/network/packet-filtering-firewalls/) before relying on UFW to restrict a Docker-published port.

<span id="source-domains-public-services"></span>

## Public TCP / UDP Services

- CapRover's NGINX routes HTTP and HTTPS by hostname.
- Other protocols need an app port mapping in **App Config**: choose a host port, a container port, and `tcp` or `udp`.
- The backend also supports Docker publish modes `ingress` and `host`.

- With `ingress`, Docker Swarm can route a published port across the cluster.
- With `host`, the port is bound on a node where the task runs; plan placement and avoid collisions between replicas.
- A mapped port may be reachable wherever your provider or host firewall allows it.

- Verify the application listens on the mapped container port.
- Restrict the host port to the intended clients and use application-level authentication and encryption as needed.
- For a database example, follow [Connect to Databases Externally](../data-persistence/deploy-databases.md).

<span id="source-domains-internal-networking"></span>

## Internal App-to-App Networking

- CapRover apps on its Docker overlay network can reach one another by service name and the destination's container port.
- For a new app named `database`, a web app can connect to `database:5432` for PostgreSQL without a public port mapping.
- Put the connection host and credentials in the consumer app's environment variables.

- Apps upgraded from older CapRover versions may retain physical service names with a `srv-captain--` prefix; the prefixed network alias remains available for compatibility.
- Check the actual service and network if name resolution fails.

This internal path is preferable for routine app-to-database traffic. Publishing a port is only necessary for an external client. See [Connect to Databases Internally](../data-persistence/deploy-databases.md).

<span id="source-applications-public-ports"></span>

## Public TCP / UDP Ports

Use an app port mapping when clients outside CapRover's Docker network need direct TCP or UDP access to a container. Internal app-to-app communication does not require a public mapping.

- In the app configuration, add a mapping with a **container port**, a **host port**, and a protocol (`tcp` or `udp`).
- Choose the publish mode: `ingress` routes through Docker Swarm's routing mesh, while `host` publishes on the node running the task.
- Host mode requires attention to placement and port conflicts when scaling or moving the app.

- Allow the host port through the provider firewall only for the clients that need it.
- Docker-published ports can bypass ordinary UFW restrictions, so use Docker-aware rules or a provider firewall to limit access.
- A publicly exposed database must have its own authentication and transport protection.
- See [Connect to Databases Externally](../data-persistence/deploy-databases.md) and [Firewall](firewall.md).
