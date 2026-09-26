---
id: advanced-certbot
title: Advanced Certbot / ACME
slug: /domains/advanced-certbot
---

The normal Certbot path uses an HTTP-01 webroot challenge. Keep port 80 reachable and the hostname pointed at CapRover. Change this only when that path cannot meet your certificate requirements.

CapRover can read `certbotCertCommandRules` and `certbotImageName` from `/captain/data/config-override.json`. DNS-01 needs a compatible, long-running Certbot plugin image and credentials readable inside that container. For a Cloudflare DNS plugin, for example, store its credentials file under `/captain/data/letsencrypt/etc/captain-files/` with restrictive permissions, then configure the image and command:

```json
{
  "certbotImageName": "YOUR_COMPATIBLE_CERTBOT_IMAGE:TAG",
  "certbotCertCommandRules": [
    {
      "domain": "*",
      "command": "certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/captain-files/mycreds.ini -d ${domainName} -d *.${domainName}"
    }
  ]
}
```

Replace the image with one that includes the DNS plugin and runs as CapRover expects; the stock image does not include every third-party DNS plugin. `${domainName}` is expanded by CapRover. A wildcard certificate requires a DNS challenge and typically includes both the base domain and its wildcard name. Test the resulting command on a disposable domain; the exact plugin flags and DNS credentials depend on your provider. If CapRover's domain verification is unsuitable for DNS-only validation, review `skipVerifyingDomains` separately and confirm ownership yourself.

Before changing a production server, save the working override and certificate state, validate your custom Certbot command against the plugin's documentation, and test issuance on a disposable domain. Restart the CapRover service with `docker service update captain-captain --force` so it loads the changed override. For an alternate ACME server, Certbot may also need a `cli.ini` under `/captain/data/letsencrypt/etc/` containing the server URL and any required external-account-binding credentials; check the ACME provider's instructions and your DNS CAA records. Never commit DNS API credentials to a repository.
