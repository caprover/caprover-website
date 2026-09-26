---
id: standard-vps
title: Standard VPS
slug: /installation/standard-vps
---

Use this path when you are bringing your own Ubuntu virtual server rather than a provider's CapRover image.

1. Create an Ubuntu 24.04 server with a public IPv4 address and SSH access. Choose AMD64 or ARM64 and at least 1 GB of RAM; more memory helps with builds.
2. In your provider's firewall, permit inbound SSH, `80/tcp`, `443/tcp`, and `3000/tcp`. Permit `443/udp` if you want HTTP/3. Keep Docker Swarm's inter-node ports private unless you are building a cluster.
3. Point a wildcard DNS A record, such as `*.apps.example.com`, directly to the server's public IP. This covers the dashboard and default app domains.
4. Follow [Getting Started](../get-started.md) from the Docker installation step through the first HTTPS app. That guide includes the server-side firewall commands, CapRover installation command, dashboard setup, and verification.

If Docker is already installed, verify `sudo docker version` and `sudo docker run --rm hello-world` before running the CapRover installer. Avoid a Docker snap installation. Check the [production checklist](../production-checklist.md) before hosting important data.
