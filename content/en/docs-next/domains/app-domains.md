---
id: app-domains
title: App Domains
slug: /domains/app-domains
---

Every web app receives a default hostname under the CapRover root domain, such as `api.apps.example.com`. The root domain's wildcard A record should already point to your CapRover server.

Create and deploy the app, then open its **HTTP Settings**. Confirm its container HTTP port matches the process inside the container and that the app is exposed as a web app. Test the default hostname over HTTP before enabling HTTPS for it. Enable HTTPS only after DNS, port 80, and the HTTP app all work; then optionally enable **Force HTTPS**.

For an independent domain owned by the app, follow [Custom Domains](./custom-domains.md). A non-web app does not use these NGINX routes; it may use an internal service name or an explicitly published TCP/UDP port.
