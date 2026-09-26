---
id: advanced-nginx
title: Advanced NGINX Configuration
slug: /domains/advanced-nginx
---

CapRover lets you edit its base NGINX configuration and dashboard routing template through server settings, and an app's NGINX template through that app's HTTP settings. Prefer app-specific changes when only one app needs a different limit or routing rule.

Generated files under `/captain/generated/nginx` show the effective output, but CapRover can overwrite them. Save changes through the relevant dashboard template. The host directory `/captain/data/nginx-shared` is mounted in the NGINX container as `/nginx-shared` for supporting files such as a custom certificate.

For a default template applied to newly created apps, CapRover can read `/captain/data/server-block-conf-override.ejs`. Begin from the matching [source template](https://github.com/caprover/caprover/blob/master/template/server-block-conf.ejs), keep a backup, and restart the CapRover service after writing the override. Test the resulting config with a disposable app before broadly applying it. An invalid global template can affect the dashboard and multiple apps.

## Recover from a configuration that broke the dashboard

If the dashboard cannot load because of a custom NGINX setting, first preserve `/captain/data/config-captain.json` and any `/captain/data/server-block-conf-override.ejs` file. If the latter caused the failure, move it out of that location before restarting CapRover. Otherwise, the following **clears the custom base, dashboard, and every app's NGINX configuration**; keep the backup so you can restore individual changes later. Run on the manager with `jq` installed:

```bash
sudo cp -a /captain/data/config-captain.json /captain/data/config-captain.json.before-nginx-reset
sudo jq '.nginxBaseConfig = "" | .nginxCaptainConfig = "" | .appDefinitions |= with_entries(.value.customNginxConfig = "")' \
  /captain/data/config-captain.json | sudo tee /captain/data/config-captain.json.new >/dev/null
sudo jq empty /captain/data/config-captain.json.new
sudo docker service scale captain-captain=0
sudo install -m 600 /captain/data/config-captain.json.new /captain/data/config-captain.json
sudo docker service scale captain-captain=1
```

Wait for `docker service ps captain-captain` and `docker service ps captain-nginx` to show healthy tasks. If this does not resolve the issue, inspect their logs and restore your backup before trying another change.
