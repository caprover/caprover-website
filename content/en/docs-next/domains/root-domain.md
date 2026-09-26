---
id: root-domain
title: Root Domain and Wildcard DNS
slug: /domains/root-domain
---

The CapRover **root domain** is the suffix used for its dashboard and default app domains. If the root is `apps.example.com`, the dashboard is `captain.apps.example.com` and an app named `api` gets `api.apps.example.com`.

At your DNS provider, create an A record for `*.apps.example.com` pointing directly to the public IP of the CapRover server. DNS providers commonly ask for `*.apps` when the zone is `example.com`. Verify that both `captain.apps.example.com` and an arbitrary app subdomain resolve to the same IP. The wildcard record does not normally cover the bare `apps.example.com` name; create a separate record if you use it.

Enter `apps.example.com` in the CapRover dashboard's root-domain setting, without `*.` or `captain.`. Keep the DNS record in place for certificate renewal. If using a DNS proxy, use DNS-only mode for initial HTTP-01 certificate setup and test the route directly to CapRover.
