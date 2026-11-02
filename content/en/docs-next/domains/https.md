---
id: https
title: HTTPS
slug: /domains/https
---

CapRover uses Certbot for dashboard and app certificates.

**Before enabling HTTPS:**

- **DNS:** The hostname resolves to your server.
- **Port 80:** Reachable from the internet for certificate validation.
- **Port 443:** Open for HTTPS traffic.

## Dashboard

1. Set your root domain.
2. Verify `http://captain.<root-domain>` works.
3. Enable **HTTPS** in dashboard settings.
4. Check the certificate, then enable **Force HTTPS**.

## Applications

1. Verify the app works over HTTP.
2. Enable **HTTPS** in the app's HTTP settings.
3. Check the certificate, then enable **Force HTTPS**.

**Notes:**

- Wildcard DNS covers subdomains; certificates are issued for the appropriate hostnames.
- Behind another reverse proxy, forward ACME validation requests to CapRover or configure an alternative challenge. See [Advanced Certbot / ACME](./advanced-certbot.md).
