---
id: troubleshooting-pro
title: Troubleshooting CapRover Pro
sidebar_label: Troubleshooting (Pro)
---

<br/>

This section is only applicable to CapRover Pro subscribers (paid plans).

## Reset OTP (two factor auth)

You may need to reset the two factor authentication in rare cases such as:

- When https://pro.caprover.com is down and you cannot access your instance
- When you have lost access to the authenticator app

In these cases, all you need to do is to simply clear the pro configs and temporarily downgrade your server to a non-paid version. You can do that by removing the `pro` content in `/captain/data/config-captain.json`

The following helper script will do exactly that:

```bash
docker service scale captain-captain=0 && \
docker run -it --rm -v /captain:/captain  caprover/caprover /bin/sh -c "wget https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/clear-pro-config.js ; node clear-pro-config.js ;" && \
docker service scale captain-captain=1 && \
echo "OKAY"

```


**Update:**

Starting v1.12.0, you can run the following script:
```bash
docker exec -it $(docker ps --filter name=captain-captain -q) npm run disable-otp
```


## Email support

Our paid Pro plan includes a 24hr SLA email support. You can email us at `pro.support at/caprover/dot/com` to get support. Please be sure to use the same email that you've used for purchase.
