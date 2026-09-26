---
id: default-push
title: Default Push Registry
slug: /deployments/registries/default-push
---

The **default push registry** stores images CapRover builds so other Swarm nodes can pull them. Choose a reachable registry in the dashboard's Cluster / Registries settings and configure its credentials. A single-node server can run without one; CapRover requires a default push registry before adding another node through its cluster workflow.

If apps were built before the registry was configured, redeploy those apps so their images are pushed and available to new nodes. Verify a fresh deployment pushes successfully before adding a worker. Keep the registry available during rollouts and recovery; disabling or deleting credentials in a cluster can prevent nodes from pulling app images.

Use a [self-hosted registry](./self-hosted.md) or an appropriate remote registry. Pull-only credentials for prebuilt images are a separate need and do not require default push.
