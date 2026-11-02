---
id: digitalocean
title: DigitalOcean
slug: /installation/digitalocean
---

**Choose an installation:**

- **Fresh Ubuntu Droplet:** Follow the full [Getting Started](../get-started.md) guide.
- **[CapRover Marketplace image](https://marketplace.digitalocean.com/apps/caprover):** Docker and CapRover are preinstalled. Start at DNS setup in [Getting Started](../get-started.md).

**For both options:**

- **Server:** Public IPv4, SSH access, at least 1 GB RAM.
- **Firewall:** Allow SSH, `80/tcp`, `443/tcp`, and `3000/tcp`. Optional: `443/udp` for HTTP/3.
- **DNS:** Point a wildcard A record (for example, `*.apps.example.com`) to the Droplet IP.
- **Verify:** Open `http://YOUR_SERVER_IP:3000`. Check that the dashboard and an app subdomain resolve before enabling HTTPS.
