---
id: standard-vps
title: Standard VPS
slug: /installation/standard-vps
---

**Requirements:**

- Ubuntu 24.04, public IPv4, SSH access
- AMD64 or ARM64, at least 1 GB RAM
- Root access and DNS control

**Setup:**

1. Create the server.
2. Allow SSH, `80/tcp`, `443/tcp`, and `3000/tcp` in the provider firewall. Optional: `443/udp` for HTTP/3.
3. Point a wildcard A record (for example, `*.apps.example.com`) to the server IP.
4. Follow [Getting Started](../get-started.md) from Docker installation through the first HTTPS app.

**Notes:**

- Keep Docker Swarm inter-node ports private unless you are creating a cluster.
- If Docker is installed, verify `sudo docker version` and `sudo docker run --rm hello-world`. Avoid the snap installation.
- Review the [production checklist](../production-checklist.md) before hosting important data.
