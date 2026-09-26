---
id: upgrade
title: Upgrade CapRover
slug: /server/upgrade
---

Before upgrading, [download a CapRover backup](./backup/create.md) and separately back up application data and volumes. Check the release notes and confirm your Docker host has enough free disk space.

In the dashboard, open **Settings** and inspect the current version, available version, and change log. Use the dashboard update action when it reports that an update is available. CapRover pulls the selected image and updates the `captain-captain` Docker service. Allow the service time to restart, then verify the dashboard, deployed apps, registry, and HTTPS.

If the update fails, check `docker service ps captain-captain --no-trunc` and `docker service logs captain-captain --tail 100` on the manager node. Preserve a backup and the previous image tag before attempting a rollback; see [Diagnostics](./diagnostics.md).

## Testing an edge image

For an advanced, temporary test of a fix available only in the edge image, record the exact current image from `docker service inspect captain-captain`, back up CapRover and app data, and then update the service image to a **specific tested edge tag or digest** using `docker service update captain-captain --image IMAGE`. This bypasses the dashboard's normal version flow. Edge images may not support downgrading to the currently released version; wait for a compatible release or restore a tested backup before switching back. Verify dashboard, apps, and service logs after any manual update.
