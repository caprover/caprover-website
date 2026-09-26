---
id: advanced-nginx
title: Advanced NGINX Configuration
slug: /domains/advanced-nginx
---

CapRover lets you edit its base NGINX configuration and dashboard routing template through server settings, and an app's NGINX template through that app's HTTP settings. Prefer app-specific changes when only one app needs a different limit or routing rule.

Generated files under `/captain/generated/nginx` show the effective output, but CapRover can overwrite them. Save changes through the relevant dashboard template. The host directory `/captain/data/nginx-shared` is mounted in the NGINX container as `/nginx-shared` for supporting files such as a custom certificate.

For a default template applied to newly created apps, CapRover can read `/captain/data/server-block-conf-override.ejs`. Begin from the matching [source template](https://github.com/caprover/caprover/blob/master/template/server-block-conf.ejs), keep a backup, and restart the CapRover service after writing the override. Test the resulting config with a disposable app before broadly applying it. An invalid global template can affect the dashboard and multiple apps.
