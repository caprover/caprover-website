---
id: nginx-routing
title: NGINX Routing
slug: /domains/nginx-routing
---

For public web requests, DNS points a hostname at the CapRover server. CapRover's NGINX service receives traffic on 80 or 443, selects the matching dashboard or app domain, and forwards the request to the app's Docker service at its configured container HTTP port.

A 502 response after a successful deployment usually means NGINX could not reach a healthy container on that port. Confirm the app listens on `0.0.0.0`, the container HTTP port is correct, and the Docker service task is running. A DNS failure occurs before this routing path, while a certificate failure can occur before HTTPS traffic reaches the app.

App-specific NGINX changes belong in that app's [Custom NGINX](../applications/advanced/custom-nginx.md) settings. Global templates affect more routes; use [Advanced NGINX Configuration](./advanced-nginx.md) carefully.
