---
id: gitlab-ci
title: GitLab CI
slug: /deployments/ci-cd/gitlab-ci
---

Build an image in GitLab CI, push it to a registry, and deploy that exact tag to CapRover. This moves the expensive build away from the CapRover server.

1. Create the app in CapRover and enable its [deployment token](./deployment-tokens.md).
2. In GitLab, store the CapRover HTTPS URL, app name, and token as protected CI/CD variables. Keep the token masked when your variable settings permit it.
3. Build and push the image with a commit-specific tag such as `$CI_COMMIT_SHA` to GitLab Container Registry.
4. If that registry image is private, add `registry.gitlab.com`, a scoped read credential, and the correct image prefix to CapRover's [private registries](../registries/private.md). Runner-side authentication alone is insufficient.
5. Deploy the pushed image from a CI job using the CapRover CLI and the app token. Verify the image tag and service health in the CapRover dashboard.

The exact GitLab runner and Docker-in-Docker setup depends on your runner and GitLab version. Avoid embedding a dashboard password or a mutable `latest` image tag in the pipeline. A GitLab push webhook is another option when building from source on CapRover is acceptable.
