---
id: gitlab-ci
title: GitLab CI
slug: /deployments/ci-cd/gitlab-ci
---

Build an image in GitLab CI, push it to GitLab Container Registry, and deploy that exact tag to CapRover. This moves the expensive build away from the CapRover server.

1. Create the app in CapRover and enable its [deployment token](./deployment-tokens.md).
2. In GitLab, store the CapRover HTTPS URL, app name, and token as protected CI/CD variables. Keep the token masked when your variable settings permit it.
3. Build and push the image with a commit-specific tag such as `$CI_COMMIT_SHA` to GitLab Container Registry.
4. If that registry image is private, add `registry.gitlab.com`, a scoped read credential, and the correct image prefix to CapRover's [private registries](../registries/private.md). Runner-side authentication alone is insufficient.
5. Make sure your GitLab runner supports Docker-in-Docker with the TLS certificate volume. Add this `.gitlab-ci.yml` to a repository with a Dockerfile:

   ```yaml
   stages: [build, deploy]

   build:
     stage: build
     image: docker:27.4.1
     services:
       - docker:27.4.1-dind
     variables:
       DOCKER_HOST: tcp://docker:2376
       DOCKER_TLS_CERTDIR: /certs
     script:
       - echo "$CI_REGISTRY_PASSWORD" | docker login "$CI_REGISTRY" -u "$CI_REGISTRY_USER" --password-stdin
       - docker build -t "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA" .
       - docker push "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
     rules:
       - if: '$CI_COMMIT_BRANCH == "main"'

   deploy:
     stage: deploy
     image: node:24-alpine
     script:
       - npm install -g caprover
       - caprover deploy --caproverUrl "$CAPROVER_URL" --caproverApp "$CAPROVER_APP" --appToken "$CAPROVER_APP_TOKEN" --imageName "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
     rules:
       - if: '$CI_COMMIT_BRANCH == "main"'
   ```

   Set `CAPROVER_URL`, `CAPROVER_APP`, and `CAPROVER_APP_TOKEN` as GitLab CI/CD variables; protect and mask the token. GitLab supplies the `CI_REGISTRY_*` and commit variables when its container registry is enabled. Replace `main` if your release branch differs.
6. Verify the image tag and service health in CapRover after the CI job succeeds. A successful CLI deployment means CapRover accepted the update; the app still needs a healthy container and correct HTTP port.

See [GitLab's Docker-in-Docker runner setup](https://docs.gitlab.com/ci/docker/docker_in_docker/) if the build cannot connect to the Docker daemon. Avoid embedding a dashboard password or a mutable `latest` image tag in the pipeline. A GitLab push webhook is another option when building from source on CapRover is acceptable.
