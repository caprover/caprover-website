---
id: certificate-renewal
title: Certificate Renewal
slug: /domains/certificate-renewal
---

CapRover manages Certbot and certificate renewal for domains whose HTTPS it controls. Leave the hostname's DNS pointing to the correct server and keep the HTTP challenge path reachable on public port 80. A certificate can fail to renew after a DNS migration, firewall change, proxy rule, or server move even when the site previously worked.

Check the certificate's expiry and the relevant Certbot/CapRover service logs if renewal fails. Verify the hostname's current DNS answer and request path before retrying. For alternate DNS-01 challenges or ACME servers, see [Advanced Certbot / ACME](./advanced-certbot.md).

If a warning names an **old domain that is no longer attached** to the dashboard or any app, distinguish its stale certificate from an active domain's expiring certificate. The [current source](https://github.com/caprover/caprover/blob/master/src/user/system/CertbotManager.ts) attempts to remove orphaned certificates after they have been expired for at least 24 hours. Check `docker service logs captain-captain --since 24h` for renewal and cleanup errors before intervening; confirm this cleanup exists in your installed version. Do not delete a certificate still used by an active domain; a failed renewal of an active hostname requires fixing its DNS, challenge path, or Certbot configuration.
