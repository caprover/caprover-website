---
id: custom-domains
title: Custom Domains
slug: /domains/custom-domains
---

You can attach an additional hostname, such as `www.example.com`, to a CapRover web app. First create a DNS record that points the hostname to the CapRover server and verify resolution. For an apex name, use an A record or a DNS-provider-supported equivalent; a normal CNAME at the apex may not be supported.

In the app's **HTTP Settings**, add the custom domain and save. Visit it over HTTP to confirm CapRover's NGINX reaches the correct app. Enable HTTPS for that domain after the HTTP route works and verify the issued certificate. Enable **Force HTTPS** if desired. Repeat certificate setup for each attached hostname that needs HTTPS.

If a domain should redirect to another hostname, configure the app's redirect-domain setting deliberately and test both source and destination. Keep DNS pointed to CapRover for any source hostname that needs CapRover to issue or renew its certificate.
