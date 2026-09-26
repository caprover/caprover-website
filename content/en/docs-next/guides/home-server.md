---
id: home-server
title: Home / Local Server Setup
slug: /guides/home-server
---

For a local test, use [Local / Private Network installation](../installation/local-private-network.md). A public home deployment also needs a stable way for incoming traffic to reach the host.

1. Install Docker and CapRover on a machine with a stable LAN address.
2. Configure your router to forward TCP 80 and 443 to that host. Access port 3000 over the LAN during setup; there is no need to forward it publicly. Check provider and host firewalls.
3. Point wildcard DNS and the dashboard hostname to the router's public address. If your ISP changes that address, use a reliable DNS update process.
4. Complete [Getting Started](../get-started.md) and verify the dashboard and a test app from a device **outside** the LAN.
5. Restrict public port 3000 after dashboard HTTPS works. Back up both CapRover state and application data off-site.

Carrier-grade NAT, blocked inbound ports, or an IPv6-only connection can prevent normal public access and certificate issuance. In those cases use a public VPS, a suitable reverse proxy/tunnel with its own security model, or keep the installation private. Check your router and ISP before troubleshooting CapRover.
