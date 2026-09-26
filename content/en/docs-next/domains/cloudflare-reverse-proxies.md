---
id: cloudflare-reverse-proxies
title: Cloudflare and Reverse Proxies
slug: /domains/cloudflare-reverse-proxies
---

For initial setup with Cloudflare DNS, point the wildcard A record to the CapRover server and choose **DNS only** (no Cloudflare proxy). Confirm the dashboard and sample app work over HTTP before requesting certificates. This lets CapRover's normal HTTP challenge reach its own NGINX service.

If you later turn on a proxy, verify its TLS mode, original `Host` header, WebSocket handling, cache behavior, and certificate renewal path. A proxy terminating HTTPS does not automatically encrypt the connection to CapRover. A redirect or challenge rule that prevents public requests to `/.well-known/acme-challenge/` from reaching CapRover can break issuance or renewal.

For an upstream reverse proxy that owns host ports 80 and 443, see [Reverse Proxy Scenarios](../installation/advanced/reverse-proxy.md). Configure and test the proxy's exact behavior before enabling forced HTTPS in both layers.
