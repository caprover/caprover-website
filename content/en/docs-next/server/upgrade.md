---
id: upgrade
title: Upgrade CapRover
slug: /server/upgrade
---

In the dashboard, open **Maintenance → CapRover Updates** and click **Install Update** when a stable update is available. On older dashboards, look under **Settings**.

Run these commands on the Swarm manager.

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
