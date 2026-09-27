---
id: home-server
title: Home / Local Server Setup
slug: /guides/home-server
---

For a local test, use [Local / Private Network installation](../installation/local-private-network.md). A public home deployment also needs a stable way for incoming traffic to reach the host.

1. Give the host a stable LAN address and install Docker as described in [Getting Started](../get-started.md).
2. Before installing CapRover with the standard public-IP installer, temporarily forward TCP 80, 443, and 3000 from the router to that host. The installer checks all three ports against the detected public IP. Check provider and host firewalls too. A router without NAT loopback may still fail this self-check; use the [local/private installation path](../installation/local-private-network.md) with an explicit LAN IP if needed.
3. Install CapRover, then point wildcard DNS and the dashboard hostname to the router's public address. If your ISP changes that address, use a reliable DNS update process.
4. Complete the root-domain and HTTPS steps in [Getting Started](../get-started.md), and verify the dashboard and a test app from a device **outside** the LAN.
5. After the dashboard works over HTTPS from outside the LAN, remove the public port 3000 forwarding rule and keep admin access through the dashboard hostname. Back up both CapRover state and application data off-site.

Carrier-grade NAT, blocked inbound ports, or an IPv6-only connection can prevent normal public access and certificate issuance. In those cases use a public VPS, a suitable reverse proxy/tunnel with its own security model, or keep the installation private. Check your router and ISP before troubleshooting CapRover.
