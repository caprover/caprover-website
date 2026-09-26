---
id: create-manage
title: Create and Manage Apps
slug: /applications/create-manage
---

In the dashboard, open **Apps**, enter a name, and create the app. Choose whether it has persistent data at creation. CapRover registers the app and initially deploys a placeholder image; deploy your own source or image from the app's **Deployment** tab.

Open the app's configuration to change its description, project, tags, environment variables, HTTP behavior, instance count, ports, or placement. Save the relevant settings and verify the service remains healthy after any change that updates Docker or NGINX. For source code or image deployment methods, see [Deployments](../deployments/index.md).

Deleting an app removes its CapRover-managed service and settings. Before deletion, identify any Docker volumes, bind-mounted files, or external database state you must preserve. Back up that data separately and verify the app's consumers no longer depend on its domains or ports.
