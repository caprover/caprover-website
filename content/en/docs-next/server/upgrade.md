---
id: upgrade
title: Upgrade CapRover
slug: /server/upgrade
---

In the dashboard, open **Maintenance → CapRover Updates** and click **Install Update** when a stable update is available. On older dashboards, look under **Settings**.

Run these commands on the Swarm manager.

<span id="docker-api-compatibility"></span>

## Docker API requirements

If the dashboard blocks an upgrade because the host Docker API is too old, upgrade Docker Engine first, then retry from the dashboard.

The `dockerApiVersion` override selects which API CapRover uses. We develop and test CapRover against the default API version. An upgrade that works with a lower API version on one release offers no guarantee for future releases.

### Manual upgrade with an override

Updating the `captain-captain` service directly bypasses CapRover's compatibility check. Captain may fail to start, leaving the dashboard unavailable, or operations such as app deployments may fail after startup. Proceed at your own risk and be prepared to verify the upgrade and recover the server.

1. [Back up CapRover and your application data](backup/index.md). Connect to a Swarm manager over SSH and record the current image reference, including its digest if present.

   ```bash
   docker service inspect --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' captain-captain
   ```

2. Replace `TARGET_VERSION` with the exact CapRover release tag and update the service.

   ```bash
   docker service update --image caprover/caprover:TARGET_VERSION captain-captain
   ```

3. Verify the version in the dashboard and check that your apps are reachable and app deployments work.
4. If the upgrade fails, replace `PREVIOUS_IMAGE` with the full image reference you recorded and redeploy it. If the release made incompatible data changes, follow the [restore guide](backup/restore.md).

   ```bash
   docker service update --image PREVIOUS_IMAGE captain-captain
   ```

<span id="testing-an-edge-image"></span>

## Switch to edge

```bash
docker pull caprover/caprover-edge:latest
docker service update captain-captain --image caprover/caprover-edge:latest
```

## Switch back to stable

```bash
docker service update captain-captain --image caprover/caprover:latest
```

Switching back may fail if the edge release introduced changes incompatible with the stable release.

If the update fails, see [Diagnostics](../troubleshooting/diagnostics.md).
