---
id: index
title: Domains & HTTPS
slug: /domains
---

<span id="source-domains-root-domain"></span>

## Root domain and wildcard DNS

Example root domain: `apps.example.com`.

| Name | Record | Result |
| --- | --- | --- |
| `*.apps` in the `example.com` zone | A → server IPv4 | `captain.apps.example.com` and `my-app.apps.example.com` |
| `apps` (optional) | A → server IPv4 | Bare `apps.example.com` |

- Enter `apps.example.com` as CapRover's root domain, without `*.` or `captain.`.
- Keep wildcard DNS pointing to CapRover for app domains and certificate renewal.
- Behind Cloudflare, use **DNS only** during initial HTTP-01 certificate validation. See [Reverse proxies](cloudflare-reverse-proxies.md).

<span id="source-domains-app-domains"></span>

## App domains

- Default app domain: `<app-name>.<root-domain>`.
- Set **Container HTTP Port** to your app's listening port. The app must bind to `0.0.0.0`.
- Workers and databases that are private services do not need public domains.

<span id="source-domains-custom-domains"></span>

## Custom domains

- Point the hostname to the CapRover server, then attach it to the app.
- For apex domains, use an A record or a DNS provider's supported alias mechanism.
- Domain redirects and certificate renewal depend on the source hostname continuing to resolve to CapRover.

<span id="source-domains-https"></span>

## HTTPS

CapRover uses Certbot to issue certificates for individual dashboard and app hostnames.

**Certificate prerequisites:**

- Hostname resolves to the correct server.
- Public `80/tcp` reaches CapRover for the HTTP-01 challenge.
- `443/tcp` is open for HTTPS.

Wildcard DNS **does not** create a wildcard TLS certificate. Each hostname needs appropriate certificate handling.

Behind an external reverse proxy, pass HTTP-01 validation requests to CapRover or configure an alternative challenge via [Advanced Certbot / ACME](advanced-certbot.md).

<span id="source-domains-certificate-renewal"></span>

## Certificate renewal

- Keep DNS and the HTTP-01 challenge route working after proxy, firewall, and server changes.
- For failures, inspect `docker service logs captain-captain --since 24h` and the affected hostname's DNS.
- Old unattached certificates can generate warnings. Recent CapRover versions attempt to remove orphaned certificates after they have been expired for at least 24 hours. Confirm against your installed version before intervening.
- Preserve certificates used by active domains; fix renewal failures at their source.
