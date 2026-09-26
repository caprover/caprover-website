---
id: networking
title: Networking
slug: /fundamentals/networking
---

There are two common routes to an app:

**Public HTTP(S):** a DNS record points the hostname to the CapRover server. CapRover's NGINX matches the hostname and proxies the request to the app's configured container HTTP port. HTTPS certificates are issued for the dashboard or app domain after DNS and public port 80 work.

**Internal service traffic:** apps on CapRover's Docker network can reach each other's services by internal service name and container port. This avoids publishing a database port to the internet.

For protocols that do not use CapRover's HTTP routing, publish a TCP or UDP app port explicitly and allow the corresponding host port in your provider firewall. Review the exposure carefully, especially for databases. See [Domains & Networking](../domains/index.md) and the complete [port reference](../reference/ports.md).
