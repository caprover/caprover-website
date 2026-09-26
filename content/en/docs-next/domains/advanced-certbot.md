---
id: advanced-certbot
title: Advanced Certbot / ACME
slug: /domains/advanced-certbot
---

The normal Certbot path uses an HTTP-01 webroot challenge. Keep port 80 reachable and the hostname pointed at CapRover. Change this only when that path cannot meet your certificate requirements.

CapRover can read `certbotCertCommandRules` and `certbotImageName` from `/captain/data/config-override.json`. DNS-01 needs a compatible Certbot plugin image and credentials stored for Certbot, and the command must request the exact desired domain names. A wildcard certificate requires a DNS challenge and typically includes both the base domain and its wildcard name.

Before changing a production server, save the working override and certificate state, validate your custom Certbot command against the plugin's documentation, and test issuance on a disposable domain. Restart the CapRover service so it loads the changed override. An alternate ACME server may also require Certbot configuration and matching DNS CAA records. Never commit DNS API credentials to a repository.
