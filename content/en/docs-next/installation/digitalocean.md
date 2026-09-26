---
id: digitalocean
title: DigitalOcean
slug: /installation/digitalocean
---

You can use a fresh Ubuntu Droplet or the [CapRover image in the DigitalOcean Marketplace](https://marketplace.digitalocean.com/apps/caprover). Choose a Droplet with a public IPv4 address, SSH access, and enough memory for your app builds (at least 1 GB to start).

With a **fresh Ubuntu Droplet**, allow SSH, `80/tcp`, `443/tcp`, and `3000/tcp` in any DigitalOcean cloud firewall attached to it. Allow `443/udp` for HTTP/3 if needed. Then follow [Getting Started](../get-started.md), including its Docker installation and UFW steps.

With the **Marketplace image**, Docker and CapRover are already installed by the image. Confirm the actual image's setup instructions in the Marketplace, find the Droplet's public IP, and open `http://IP:3000`. Continue with the DNS, dashboard security, and first-deployment steps in [Getting Started](../get-started.md). Keep the provider firewall aligned with the ports listed above.

In either case, create a wildcard A record for the root domain you choose, such as `*.apps.example.com`, pointing to the Droplet IP. Wait until the dashboard and a sample app domain both resolve before requesting HTTPS certificates.
