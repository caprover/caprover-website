---
id: index
title: Container Registries
slug: /deployments/registries
---

<span id="source-deployments-registries-private"></span>

## Private Registries

- CapRover needs registry credentials when a Docker image is private.
- In the dashboard's **Cluster / Registries** area, add a remote registry with its domain, username, password or read token, and optional image prefix.
- CapRover matches pull credentials against the image name beginning with `DOMAIN/PREFIX/` when a prefix is set, or `DOMAIN/` when it is blank.
- It also uses the prefix when tagging CapRover-built images for the default push registry.
- Verify the complete image name before relying on those credentials.

- For `ghcr.io/my-org/my-api:tag`, use registry domain `ghcr.io` and the matching owner or organization path as the image prefix, with a credential allowed to read that package.
- For `registry.gitlab.com/my-group/my-project/image:tag`, use the matching GitLab registry path and a scoped read credential.

- Deploy an image using its full registry-qualified name and verify it can be pulled on every intended node.
- Pushing an image from CI does not automatically authenticate CapRover to pull it.
- If you only need to pull prebuilt images, do not select this registry as the default push registry for CapRover-built images.

<span id="source-deployments-registries-default-push"></span>

## Default Push Registry

- The **default push registry** stores images CapRover builds so other Swarm nodes can pull them.
- Choose a reachable registry in the dashboard's Cluster / Registries settings and configure its credentials.
- A single-node server can run without one; CapRover requires a default push registry before adding another node through its cluster workflow.

- If apps were built before the registry was configured, redeploy those apps so their images are pushed and available to new nodes.
- Verify a fresh deployment pushes successfully before adding a worker.
- Keep the registry available during rollouts and recovery; disabling or deleting credentials in a cluster can prevent nodes from pulling app images.

Use a [self-hosted registry](index.md#source-deployments-registries-self-hosted) or an appropriate remote registry. Pull-only credentials for prebuilt images are a separate need and do not require default push.

<span id="source-deployments-registries-self-hosted"></span>

## Self-Hosted Registry

- CapRover can manage a Docker registry for its own cluster.
- Configure it in the dashboard's Cluster / Registries area, then select it as the default push registry when you plan to add nodes.
- Check that every node can reach the registry before deploying across the cluster.

- CapRover's self-hosted registry uses port `996/tcp` for registry access.
- Expose it only where the clients or nodes need it, and protect it with the configured authentication.
- A registry on the same physical server is still a dependency: if that server or its image storage is unavailable, new nodes may not be able to pull images.

After enabling default push, redeploy existing built apps to publish their images. Then follow the [multi-node setup guide](../../scaling/multi-node.md) to add and verify workers.
