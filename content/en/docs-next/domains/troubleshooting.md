---
id: troubleshooting
title: Troubleshooting
slug: /domains/troubleshooting
---

Check the request path in order:

1. **DNS:** Does the exact hostname resolve to the intended server IP? Check wildcard and custom records, and any stale AAAA record.
2. **Firewall:** Do public ports 80 and 443 reach CapRover? Is a provider firewall or proxy intercepting them?
3. **HTTP routing:** Does plain HTTP select the correct app? If it returns 502, check the container HTTP port, app listen address, and Docker task state.
4. **Certificate:** Did HTTPS get enabled for this exact hostname? Check the Certbot logs and HTTP challenge reachability before retrying.
5. **Redirects:** After HTTPS works, test Force HTTPS and any redirect-domain or reverse-proxy rule for loops.

Record the failing hostname, DNS answer, HTTP response, and relevant service logs. Remove tokens and passwords before sharing diagnostics. See [Firewall](./firewall.md) and [HTTPS](./https.md) for the setup prerequisites.

If CapRover reports **domain verification error 1107**, first confirm that the exact domain resolves directly to this server and is reachable on port 80 from outside your network. A DNS proxy or incorrect AAAA record can make CapRover's view differ from yours. For a private network where a public DNS verification cannot work, see [Local / Private Network](../installation/local-private-network.md); its `skipVerifyingDomains` override disables CapRover's check but does not make DNS or public certificate issuance work. Do not enable that override to conceal a broken public DNS configuration.
