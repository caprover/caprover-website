---
id: index
title: Server Administration
slug: /server
---

<span id="source-server-settings"></span>

## Server Settings

Use the dashboard's **Settings** area to manage the root domain, account password, updates, and CapRover backups. Back up the server before changing its domain or upgrading.

### Root domain

Point the wildcard DNS record and dashboard hostname at the server before setting the root domain. Changing it affects generated app and dashboard hostnames; check DNS and renew HTTPS certificates after the change. If you use the self hosted registry, remove or migrate that registry before changing the domain. See [DNS and domains](../domains/index.md).

### Account and recovery

Change the initial password after installation, secure the dashboard with HTTPS, and store recovery credentials safely. Review [Security & Access](index.md) and [Backup & Restore](backup/index.md) before production use.

<span id="source-server-security"></span>

## Security & Access

- Change the initial dashboard password, enable HTTPS for the dashboard, and restrict access to ports and SSH using host and provider firewalls.
- Limit Swarm ports to trusted cluster nodes; see [Multi-Node Setup](../scaling/multi-node.md).
- Keep Docker and CapRover updated.

- Treat deployment tokens, registry credentials, environment variables, backup archives, and SSH keys as secrets.
- Use separate credentials for automation, rotate them when exposed, and review the [CapRover Pro](index.md) two-factor options if your instance uses Pro.
- A person with Docker socket access on the manager effectively has broad host control; grant shell and dashboard access deliberately.

Back up CapRover configuration and application data separately and practice restoration. For access problems, see [Diagnostics](../troubleshooting/diagnostics.md).

### Recover a forgotten dashboard password

- Use the dashboard's normal password-change flow when you can still sign in.
- If you have lost access but retain shell access to the manager, the current [authenticator](https://github.com/caprover/caprover/blob/master/src/user/Authenticator.ts) falls back to `DEFAULT_PASSWORD` only when no saved password hash exists.
- This procedure briefly stops CapRover and changes its saved configuration.
- Have a recent backup, and run it only on your own server:

1. Ensure `jq` is installed, record the current `captain-captain` service image, and back up `/captain/data/config-captain.json` outside the server.
2. Prepare the replacement configuration while the service is running:

   ```bash
   sudo cp -a /captain/data/config-captain.json /captain/data/config-captain.json.before-password-reset
   sudo jq 'del(.hashedPassword)' /captain/data/config-captain.json | sudo tee /captain/data/config-captain.json.new >/dev/null
   sudo jq empty /captain/data/config-captain.json.new
   ```

3. Choose a temporary password of at least eight characters. Stop CapRover, install the prepared file, set the temporary password, then restart the service:

   ```bash
   read -rsp 'Temporary password: ' CAPROVER_TEMP_PASSWORD; echo
   sudo docker service scale captain-captain=0
   sudo install -m 600 /captain/data/config-captain.json.new /captain/data/config-captain.json
   sudo docker service update --env-add "DEFAULT_PASSWORD=$CAPROVER_TEMP_PASSWORD" captain-captain
   sudo docker service scale captain-captain=1
   unset CAPROVER_TEMP_PASSWORD
   ```

4. Sign in over HTTPS, change the temporary password in Settings, and verify the new login. Remove the temporary environment variable from the Docker service with `sudo docker service update --env-rm DEFAULT_PASSWORD captain-captain`, then verify login once more. The temporary value may be visible in Docker service inspection until removed. Keep the original backed-up configuration until recovery succeeds.

If two-factor authentication also blocks access, see [Pro OTP recovery](index.md). These are separate recovery steps.

<span id="source-server-pro"></span>

## CapRover Pro

- CapRover Pro adds subscription-backed features configured through the dashboard with a Pro API key.
- Available controls include two-factor authentication, login alerts, build-success and build-failure alerts, and email or webhook actions.
- Check the dashboard's Pro settings for the options enabled on your subscription.

- Set up and test an alert destination before relying on it.
- Store your Pro key securely.
- When two-factor authentication is enabled, an interactive CLI login with your dashboard password also requires the current one-time code:

```bash
CAPROVER_OTP_TOKEN=123456 caprover login
```

- Replace `123456` with a current code.
- The CLI sends `CAPROVER_OTP_TOKEN` during password-based authentication, including a login triggered by `caprover deploy` when it needs a new session.
- For app-scoped CI, use an [app deployment token](../deployments/ci-cd/index.md) instead of a dashboard password and a time-sensitive OTP.
- If you lose access to your one-time password, an administrator with shell access to the manager can run the recovery script inside the CapRover container:

```bash
docker exec -it "$(docker ps --filter name=captain-captain -q | head -n 1)" npm run disable-otp
```

Verify the target container first, use this only for your own instance, then sign in and configure two-factor authentication again. See [Pro troubleshooting](../troubleshooting/diagnostics.md).

**Pro email alerts:** If you need alerts in a different inbox, inspect a current alert sender (historically `alerts@mail.pro.caprover.com`) and use an email filter/forwarding rule. Test the forwarding before relying on it.

<span id="source-server-themes"></span>

## Dashboard Themes

- The dashboard's **Themes** settings let you choose a built-in theme or create a custom one.
- Custom theme content is a JavaScript object passed to Ant Design, rather than JSON text.
- The editor provides `isDarkMode`, `darkAlgorithm`, and `defaultAlgorithm`:

```javascript
{
  algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
  token: {
    colorPrimary: '#2769c5',
    colorBgBase: isDarkMode ? '#101010' : '#ffffff',
    borderRadius: 6,
    fontSize: 14
  }
}
```

- The **head embed** field can load a font or other head markup, for example `<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet" />`.
- The **extra configuration** field accepts a JavaScript object such as `{ siderTheme: 'dark' }` for a dark sidebar.
- Review code before adding scripts to the dashboard head.
- Save your work, select the theme, and check readability in both light and dark modes.
- You can edit or delete custom themes; built-in themes are protected.

Themes only affect the dashboard appearance; application styling belongs in the application itself. The [built-in theme definitions](https://github.com/caprover/caprover/tree/master/template/themes) and [Ant Design theme tokens](https://ant.design/docs/react/customize-theme) provide more examples.
