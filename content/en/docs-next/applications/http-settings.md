---
id: http-settings
title: HTTP Settings
slug: /applications/http-settings
---

## Web apps

- Requests reach your app through CapRover's NGINX.
- Set **Container HTTP Port** to the port your process listens on (often `80` for NGINX).
- Bind the app to `0.0.0.0` inside the container.

## Domains and HTTPS

- Default hostname: `<app-name>.<root-domain>`
- Custom domains: Point DNS to the server, then add the domain.
- HTTPS: Verify DNS and ports 80/443, enable HTTPS, then enable **Force HTTPS**.

See [App Domains](../domains/app-domains.md) and [HTTPS](../domains/https.md).

## Other options

- **Private services:** Select **Do not expose as web app** for workers and private databases.
- **WebSocket:** Enable support where required by the app.
- **HTTP Basic Authentication:** Restricts access to HTTP endpoints. Keep application permissions configured separately.
- **Redirect domains:** Sends incoming requests to another domain. Verify the destination first.
