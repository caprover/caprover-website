---
id: advanced-nginx
title: Advanced NGINX Configuration
slug: /domains/advanced-nginx
---

- CapRover lets you edit its base NGINX configuration and dashboard routing template through server settings, and an app's NGINX template through that app's HTTP settings.
- Prefer app-specific changes when only one app needs a different limit or routing rule.

- Generated files under `/captain/generated/nginx` show the effective output, but CapRover can overwrite them.
- Save changes through the relevant dashboard template.
- The host directory `/captain/data/nginx-shared` is mounted in the NGINX container as `/nginx-shared` for supporting files such as a custom certificate.

- For a default template applied to newly created apps, CapRover can read `/captain/data/server-block-conf-override.ejs`.
- Begin from the matching [source template](https://github.com/caprover/caprover/blob/master/template/server-block-conf.ejs), keep a backup, and restart the CapRover service after writing the override.
- Test the resulting config with a disposable app before broadly applying it.
- An invalid global template can affect the dashboard and multiple apps.

## Recover from a configuration that broke the dashboard

- If the dashboard cannot load because of a custom NGINX setting, first preserve `/captain/data/config-captain.json` and any `/captain/data/server-block-conf-override.ejs` file.
- If the latter caused the failure, move it out of that location before restarting CapRover.
- Otherwise, the following **clears the custom base, dashboard, and every app's NGINX configuration**; keep the backup so you can restore individual changes later.
- Run on the manager with `jq` installed:

```bash
sudo cp -a /captain/data/config-captain.json /captain/data/config-captain.json.before-nginx-reset
sudo jq '.nginxBaseConfig = "" | .nginxCaptainConfig = "" | .appDefinitions |= with_entries(.value.customNginxConfig = "")' \
  /captain/data/config-captain.json | sudo tee /captain/data/config-captain.json.new >/dev/null
sudo jq empty /captain/data/config-captain.json.new
sudo docker service scale captain-captain=0
sudo install -m 600 /captain/data/config-captain.json.new /captain/data/config-captain.json
sudo docker service scale captain-captain=1
```

- Wait for `docker service ps captain-captain` and `docker service ps captain-nginx` to show healthy tasks.
- If this does not resolve the issue, inspect their logs and restore your backup before trying another change.

## NGINX Routing {source-domains-nginx-routing}

- For public web requests, DNS points a hostname at the CapRover server.
- CapRover's NGINX service receives traffic on 80 or 443, selects the matching dashboard or app domain, and forwards the request to the app's Docker service at its configured container HTTP port.

- A 502 response after a successful deployment usually means NGINX could not reach a healthy container on that port.
- Confirm the app listens on `0.0.0.0`, the container HTTP port is correct, and the Docker service task is running.
- A DNS failure occurs before this routing path, while a certificate failure can occur before HTTPS traffic reaches the app.

App-specific NGINX changes belong in that app's [Custom NGINX](advanced-nginx.md#source-applications-advanced-custom-nginx) settings. Global templates affect more routes; use [Advanced NGINX Configuration](advanced-nginx.md) carefully.

## Custom NGINX {source-applications-advanced-custom-nginx}

- CapRover generates NGINX configuration for each web app.
- Use the app's **HTTP Settings** to edit its NGINX template when you need a route-specific timeout, upload limit, or other NGINX behavior that the standard controls do not expose.

1. Save a copy of the current template before editing.
2. Change the smallest relevant directive and save it in the dashboard.
3. Verify the dashboard accepts the NGINX configuration, then test every domain attached to the app over HTTP and HTTPS. A shared app template affects those domains together.

- An invalid configuration can interrupt routing.
- CapRover validates and attempts to revert an invalid app configuration, but keep the last working template to recover quickly.
- Generated files under `/captain/generated/nginx` are output, not the source to edit; CapRover can overwrite them.

For changes to the global NGINX or dashboard templates, see [Advanced NGINX Configuration](advanced-nginx.md). Use that broader scope only when the app-specific template cannot meet your needs.
