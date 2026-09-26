---
id: private
title: Private Registries
slug: /deployments/registries/private
---

CapRover needs registry credentials when a Docker image is private. In the dashboard's **Cluster / Registries** area, add a remote registry with its domain, username, password or read token, and image prefix. The prefix identifies which image names should use those credentials.

For `ghcr.io/my-org/my-api:tag`, use registry domain `ghcr.io` and the matching owner or organization path as the image prefix, with a credential allowed to read that package. For `registry.gitlab.com/my-group/my-project/image:tag`, use the matching GitLab registry path and a scoped read credential.

Deploy an image using its full registry-qualified name and verify it can be pulled on every intended node. Pushing an image from CI does not automatically authenticate CapRover to pull it. If you only need to pull prebuilt images, do not select this registry as the default push registry for CapRover-built images.
