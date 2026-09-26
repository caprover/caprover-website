---
id: upgrade
title: Upgrade One-Click Apps
slug: /one-click-apps/upgrade
---

One-Click Apps do not all share an upgrade procedure. Identify the installed app's image, generated configuration, persistent storage, and upstream application's migration requirements first. Back up its data and test a restore.

For a simple image-only service, deploy a tested newer image tag through the app's **Deployment** tab and verify logs and data afterward. Some templates build a customized image or require initialization steps, so replacing the image with the upstream base image can discard important behavior. Products such as WordPress or databases may also require an application-level or schema upgrade.

Do not delete and recreate a stateful app as a routine upgrade path. If recreation is necessary, preserve the actual named volumes, confirm the new app mounts them correctly, and test on a copy before touching production.
