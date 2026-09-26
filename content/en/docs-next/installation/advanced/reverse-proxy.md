---
id: reverse-proxy
title: Reverse Proxy Scenarios
slug: /installation/advanced/reverse-proxy
---

CapRover already runs NGINX for its dashboard and web applications. The simplest public installation lets CapRover own ports 80 and 443. If another reverse proxy must terminate traffic first, plan the routing before installing CapRover.

The external proxy must pass requests for the dashboard and all application domains to CapRover, preserve the original `Host` header, support WebSocket upgrades for apps that need them, and handle certificate issuance and renewal deliberately. CapRover's own Let's Encrypt HTTP challenge needs its validation requests to reach CapRover on port 80. Terminating HTTPS at a proxy does not automatically provide HTTPS between the proxy and CapRover.

For a fresh install behind a proxy that owns the standard host ports, see [Custom Host Ports](./custom-host-ports.md) to publish CapRover on different host ports. Verify dashboard routing, a sample app, and certificate behavior before moving existing traffic. See [Cloudflare and Reverse Proxies](../../domains/cloudflare-reverse-proxies.md) for domain-level considerations.

Reverse proxy configurations depend on the proxy and the desired TLS boundary. This page does not prescribe a universal configuration; a tested provider-specific configuration is deferred.
