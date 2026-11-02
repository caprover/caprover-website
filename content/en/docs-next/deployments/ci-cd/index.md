---
id: index
title: CI/CD
slug: /deployments/ci-cd
---

<span id="source-deployments-ci-cd-deployment-tokens"></span>

## Deployment Tokens

- An app deployment token lets automation deploy one CapRover app without using the dashboard password.
- Create the app, open its **Deployment** tab, enable the app token, and copy the value into your CI system's secret store.
- Treat both the token and any Git webhook URL as credentials.

- Use the HTTPS dashboard URL and the exact app name in CI.
- For the CLI, supply `--appToken` or set `CAPROVER_APP_TOKEN` in the process environment, together with the server URL and app name.
- The community [GitHub deployment action](index.md) accepts the token as its `token` input.

- If the token is exposed, replace or disable it in the app settings and update your CI secret.
- Give each deployment job only the registry credentials it also needs; an app token does not grant the CapRover server access to a private image registry.

<span id="source-deployments-ci-cd-github-actions"></span>

## GitHub Actions

Create a CapRover app and enable its [deployment token](index.md). In your GitHub repository, add `CAPROVER_APP_TOKEN` as an Actions secret. Add a `captain-definition` file for source deployments.

For a small source build on the CapRover server, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to CapRover
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: caprover/deploy-from-github@v2
        with:
          server: https://captain.apps.example.com
          app: my-app
          token: ${{ secrets.CAPROVER_APP_TOKEN }}
```

- Replace the server URL and app name.
- The action packages committed files from the checked-out commit; a generated or uncommitted file requires its `tar-file` input.
- For heavy builds, build and push an image in Actions and pass its name through the action's `image` input.
- If the image is private, [configure registry credentials on CapRover](../registries/index.md) as well as on the runner.

Review the [action's current inputs and image example](https://github.com/caprover/deploy-from-github) before adapting this workflow. An accepted token deployment can finish asynchronously; verify the resulting CapRover build and app health separately.

<span id="source-deployments-ci-cd-gitlab-ci"></span>

## GitLab CI

Build an image in GitLab CI, push it to GitLab Container Registry, and deploy that exact tag to CapRover. This moves the expensive build away from the CapRover server.

1. Create the app in CapRover and enable its [deployment token](index.md).
2. In GitLab, store the CapRover HTTPS URL, app name, and token as protected CI/CD variables. Keep the token masked when your variable settings permit it.
3. Build and push the image with a commit-specific tag such as `$CI_COMMIT_SHA` to GitLab Container Registry.
4. If that registry image is private, add `registry.gitlab.com`, a scoped read credential, and the correct image prefix to CapRover's [private registries](../registries/index.md). Runner-side authentication alone is insufficient.
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

- Set `CAPROVER_URL`, `CAPROVER_APP`, and `CAPROVER_APP_TOKEN` as GitLab CI/CD variables; protect and mask the token.
- GitLab supplies the `CI_REGISTRY_*` and commit variables when its container registry is enabled.
- Replace `main` if your release branch differs.
6. Verify the image tag and service health in CapRover after the CI job succeeds. A successful CLI deployment means CapRover accepted the update; the app still needs a healthy container and correct HTTP port.

- See [GitLab's Docker-in-Docker runner setup](https://docs.gitlab.com/ci/docker/docker_in_docker/) if the build cannot connect to the Docker daemon.
- Avoid embedding a dashboard password or a mutable `latest` image tag in the pipeline.
- A GitLab push webhook is another option when building from source on CapRover is acceptable.

<span id="source-deployments-ci-cd-generic"></span>

## Generic CI

- Any CI system can deploy to CapRover if it can reach the dashboard over HTTPS and hold an app [deployment token](index.md).
- Choose either a source archive containing `captain-definition` or a prebuilt image accessible to the server.

- The simplest repeatable release flow is: build an image, tag it with an immutable commit or release identifier, push it to a registry, authorize CapRover to pull it, then deploy that exact image using the CLI or API.
- Keep the app token and registry credential in the CI secret store, avoid printing them in logs, and verify final app health after CapRover accepts the deployment.

If CI sends source instead, the CapRover server performs the build and needs enough memory and disk. See [Builds and Build Logs](../builds-logs.md) for troubleshooting.
