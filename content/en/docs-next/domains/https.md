---
id: https
title: HTTPS
slug: /domains/https
---

CapRover uses Certbot to request certificates for the dashboard and app domains. Before clicking **Enable HTTPS**, make sure the exact hostname resolves to the intended server, external port `80/tcp` reaches CapRover for the normal HTTP challenge, and `443/tcp` is open for HTTPS traffic.

For the dashboard, set the root domain and confirm `http://captain.<root-domain>` works. Enable dashboard HTTPS in settings, visit the HTTPS URL, verify its certificate, then enable **Force HTTPS**. For an app, test the app domain over HTTP first, enable HTTPS in its HTTP settings, verify the certificate, and only then force HTTPS.

Wildcard DNS makes names resolve; it does not create one wildcard certificate. Each hostname still needs appropriate certificate handling. For a reverse proxy, ensure the ACME validation request reaches CapRover or deliberately configure a supported alternative challenge. See [Advanced Certbot / ACME](./advanced-certbot.md).
