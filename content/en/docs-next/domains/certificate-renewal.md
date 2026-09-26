---
id: certificate-renewal
title: Certificate Renewal
slug: /domains/certificate-renewal
---

CapRover manages Certbot and certificate renewal for domains whose HTTPS it controls. Leave the hostname's DNS pointing to the correct server and keep the HTTP challenge path reachable on public port 80. A certificate can fail to renew after a DNS migration, firewall change, proxy rule, or server move even when the site previously worked.

Check the certificate's expiry and the relevant Certbot/CapRover service logs if renewal fails. Verify the hostname's current DNS answer and request path before retrying. For alternate DNS-01 challenges or ACME servers, see [Advanced Certbot / ACME](./advanced-certbot.md).
