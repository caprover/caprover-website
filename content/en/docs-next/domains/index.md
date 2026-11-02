---
id: index
title: Domains & Networking
slug: /domains
---

## Root Domain and Wildcard DNS {source-domains-root-domain}

- The CapRover **root domain** is the suffix used for its dashboard and default app domains.
- If the root is `apps.example.com`, the dashboard is `captain.apps.example.com` and an app named `api` gets `api.apps.example.com`.

- At your DNS provider, create an A record for `*.apps.example.com` pointing directly to the public IP of the CapRover server.
- DNS providers commonly ask for `*.apps` when the zone is `example.com`.
- Verify that both `captain.apps.example.com` and an arbitrary app subdomain resolve to the same IP.
- The wildcard record does not normally cover the bare `apps.example.com` name; create a separate record if you use it.

- Enter `apps.example.com` in the CapRover dashboard's root-domain setting, without `*.` or `captain.`.
- Keep the DNS record in place for certificate renewal.
- If using a DNS proxy, use DNS-only mode for initial HTTP-01 certificate setup and test the route directly to CapRover.

## App Domains {source-domains-app-domains}

Every web app receives a default hostname under the CapRover root domain, such as `api.apps.example.com`. The root domain's wildcard A record should already point to your CapRover server.

- Create and deploy the app, then open its **HTTP Settings**.
- Confirm its container HTTP port matches the process inside the container and that the app is exposed as a web app.
- Test the default hostname over HTTP before enabling HTTPS for it.
- Enable HTTPS only after DNS, port 80, and the HTTP app all work; then optionally enable **Force HTTPS**.

- For an independent domain owned by the app, follow [Custom Domains](index.md#source-domains-custom-domains).
- A non-web app does not use these NGINX routes; it may use an internal service name or an explicitly published TCP/UDP port.

## Custom Domains {source-domains-custom-domains}

- You can attach an additional hostname, such as `www.example.com`, to a CapRover web app.
- First create a DNS record that points the hostname to the CapRover server and verify resolution.
- For an apex name, use an A record or a DNS-provider-supported equivalent; a normal CNAME at the apex may not be supported.

- In the app's **HTTP Settings**, add the custom domain and save.
- Visit it over HTTP to confirm CapRover's NGINX reaches the correct app.
- Enable HTTPS for that domain after the HTTP route works and verify the issued certificate.
- Enable **Force HTTPS** if desired.
- Repeat certificate setup for each attached hostname that needs HTTPS.

- If a domain should redirect to another hostname, configure the app's redirect-domain setting deliberately and test both source and destination.
- Keep DNS pointed to CapRover for any source hostname that needs CapRover to issue or renew its certificate.

## HTTPS {source-domains-https}

CapRover uses Certbot for dashboard and app certificates.

**Before enabling HTTPS:**

- **DNS:** The hostname resolves to your server.
- **Port 80:** Reachable from the internet for certificate validation.
- **Port 443:** Open for HTTPS traffic.

### Dashboard

1. Set your root domain.
2. Verify `http://captain.<root-domain>` works.
3. Enable **HTTPS** in dashboard settings.
4. Check the certificate, then enable **Force HTTPS**.

### Applications

1. Verify the app works over HTTP.
2. Enable **HTTPS** in the app's HTTP settings.
3. Check the certificate, then enable **Force HTTPS**.

**Notes:**

- Wildcard DNS covers subdomains; certificates are issued for the appropriate hostnames.
- Behind another reverse proxy, forward ACME validation requests to CapRover or configure an alternative challenge. See [Advanced Certbot / ACME](advanced-certbot.md).

## Certificate Renewal {source-domains-certificate-renewal}

- CapRover manages Certbot and certificate renewal for domains whose HTTPS it controls.
- Leave the hostname's DNS pointing to the correct server and keep the HTTP challenge path reachable on public port 80.
- A certificate can fail to renew after a DNS migration, firewall change, proxy rule, or server move even when the site previously worked.

- Check the certificate's expiry and the relevant Certbot/CapRover service logs if renewal fails.
- Verify the hostname's current DNS answer and request path before retrying.
- For alternate DNS-01 challenges or ACME servers, see [Advanced Certbot / ACME](advanced-certbot.md).

- If a warning names an **old domain that is no longer attached** to the dashboard or any app, distinguish its stale certificate from an active domain's expiring certificate.
- The [current source](https://github.com/caprover/caprover/blob/master/src/user/system/CertbotManager.ts) attempts to remove orphaned certificates after they have been expired for at least 24 hours.
- Check `docker service logs captain-captain --since 24h` for renewal and cleanup errors before intervening; confirm this cleanup exists in your installed version.
- Do not delete a certificate still used by an active domain; a failed renewal of an active hostname requires fixing its DNS, challenge path, or Certbot configuration.
