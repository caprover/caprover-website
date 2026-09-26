---
id: custom-nginx
title: Custom NGINX
slug: /applications/advanced/custom-nginx
---

CapRover generates NGINX configuration for each web app. Use the app's **HTTP Settings** to edit its NGINX template when you need a route-specific timeout, upload limit, or other NGINX behavior that the standard controls do not expose.

1. Save a copy of the current template before editing.
2. Change the smallest relevant directive and save it in the dashboard.
3. Verify the dashboard accepts the NGINX configuration, then test every domain attached to the app over HTTP and HTTPS. A shared app template affects those domains together.

An invalid configuration can interrupt routing. CapRover validates and attempts to revert an invalid app configuration, but keep the last working template to recover quickly. Generated files under `/captain/generated/nginx` are output, not the source to edit; CapRover can overwrite them.

For changes to the global NGINX or dashboard templates, see [Advanced NGINX Configuration](../../domains/advanced-nginx.md). Use that broader scope only when the app-specific template cannot meet your needs.
