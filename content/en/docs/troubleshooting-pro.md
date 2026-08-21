---
id: troubleshooting-pro
title: Troubleshooting CapRover Pro
sidebar_label: Troubleshooting (Pro)
---

<br/>

This section is only applicable to CapRover Pro subscribers (paid plans). You can subscribe to paid plans and benefit from additional features such as build status notifications, security upgrades such as login alerts and two factor authentication.

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

## Deploy with OTP enabled

When you have OTP enabled, you cannot deploy using regular `caprover deploy` as it requires 2FA token (`enter OTP token as well`). Instead, you should use App Tokens:

```bash
caprover deploy --caproverUrl https://captain.domain.com --appToken 123456123456123456 --appName my-app -b main
```

You can enable App Token from Deployment tab. Alternatively, you can use the following format (not recommended):

```bash
CAPROVER_OTP_TOKEN=123456; caprover login

## or

CAPROVER_OTP_TOKEN=123456; caprover deploy
```

## Set specific email address for the alerts

Changing notification emails is not currently a built in feature. However, one of the many reasons that Google was chosen to be our auth provider is that on Gmail you can easily set up filters and forward specific emails to a different email address.

Just search for `from: alerts@mail.pro.caprover.com` and create a filter, then forward your results to another email address.

![gmail-instruction-1](/img/docs/gmail-1.png)
![gmail-instruction-2](/img/docs/gmail-2.png)

## Email support

Our paid Pro plan includes a 24hr SLA email support. You can email us at `pro.support at/caprover/dot/com` to get support. Please be sure to use the same email that you've used for purchase.
