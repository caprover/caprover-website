---
id: pro
title: CapRover Pro
slug: /server/pro
---

CapRover Pro adds subscription-backed features configured through the dashboard with a Pro API key. Available controls include two-factor authentication, login alerts, build-success and build-failure alerts, and email or webhook actions. Check the dashboard's Pro settings for the options enabled on your subscription.

Set up and test an alert destination before relying on it. Store your Pro key securely. When two-factor authentication is enabled, an interactive CLI login with your dashboard password also requires the current one-time code:

```bash
CAPROVER_OTP_TOKEN=123456 caprover login
```

Replace `123456` with a current code. The CLI sends `CAPROVER_OTP_TOKEN` during password-based authentication, including a login triggered by `caprover deploy` when it needs a new session. For app-scoped CI, use an [app deployment token](../deployments/ci-cd/deployment-tokens.md) instead of a dashboard password and a time-sensitive OTP. If you lose access to your one-time password, an administrator with shell access to the manager can run the recovery script inside the CapRover container:

```bash
docker exec -it "$(docker ps --filter name=captain-captain -q | head -n 1)" npm run disable-otp
```

Verify the target container first, use this only for your own instance, then sign in and configure two-factor authentication again. See [Pro troubleshooting](../troubleshooting/diagnostics.md).
