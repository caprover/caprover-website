---
id: self-hosted
title: Self-Hosted Registry
slug: /deployments/registries/self-hosted
---

CapRover can manage a Docker registry for its own cluster. Configure it in the dashboard's Cluster / Registries area, then select it as the default push registry when you plan to add nodes. Check that every node can reach the registry before deploying across the cluster.

CapRover's self-hosted registry uses port `996/tcp` for registry access. Expose it only where the clients or nodes need it, and protect it with the configured authentication. A registry on the same physical server is still a dependency: if that server or its image storage is unavailable, new nodes may not be able to pull images.

After enabling default push, redeploy existing built apps to publish their images. Then follow the [multi-node setup guide](../../scaling/multi-node.md) to add and verify workers.
