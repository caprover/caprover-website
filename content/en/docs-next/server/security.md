---
id: security
title: Security & Access
slug: /server/security
---

Change the initial dashboard password, enable HTTPS for the dashboard, and restrict access to ports and SSH using host and provider firewalls. Limit Swarm ports to trusted cluster nodes; see [Multi-Node Setup](../scaling/multi-node.md). Keep Docker and CapRover updated.

Treat deployment tokens, registry credentials, environment variables, backup archives, and SSH keys as secrets. Use separate credentials for automation, rotate them when exposed, and review the [CapRover Pro](./pro.md) two-factor options if your instance uses Pro. A person with Docker socket access on the manager effectively has broad host control; grant shell and dashboard access deliberately.

Back up CapRover configuration and application data separately and practice restoration. For access problems, see [Diagnostics](./diagnostics.md).

## Recover a forgotten dashboard password

Use the dashboard's normal password-change flow when you can still sign in. If you have lost access but retain shell access to the manager, the current [authenticator](https://github.com/caprover/caprover/blob/master/src/user/Authenticator.ts) falls back to `DEFAULT_PASSWORD` only when no saved password hash exists. This procedure briefly stops CapRover and changes its saved configuration. Have a recent backup, and run it only on your own server:

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

If two-factor authentication also blocks access, see [Pro OTP recovery](./pro.md). These are separate recovery steps.
