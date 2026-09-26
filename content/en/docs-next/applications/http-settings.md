---
id: http-settings
title: HTTP Settings
slug: /applications/http-settings
---

An HTTP app receives requests through CapRover's NGINX. In the app's **HTTP Settings**, set the **Container HTTP Port** to the port on which the process listens inside its container. This is usually `80` for NGINX images and often another port for frameworks. The app should listen on `0.0.0.0`, not only `127.0.0.1` inside the container.

The default app hostname is `<app-name>.<root-domain>`. You can add custom domains after their DNS points to the server. Enable HTTPS for each domain only after DNS resolves and ports 80 and 443 reach CapRover; then optionally enable **Force HTTPS**. See [App Domains](../domains/app-domains.md) and [HTTPS](../domains/https.md).

For a database or worker that does not serve web traffic, select **Do not expose as web app**. WebSocket support, HTTP Basic Authentication, and redirect domains are additional HTTP settings. Basic Authentication protects HTTP access to the app; it does not replace your app's own user permissions. A redirect domain sends traffic to another domain, so confirm the destination works before enabling it.
