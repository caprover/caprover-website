---
id: index
title: CI/CD
slug: /deployments/ci-cd
---

<span id="source-deployments-ci-cd-deployment-tokens"></span>

## 应用部署 Token

- 应用部署 token 允许 CI 只部署指定的 CapRover 应用，无需使用 dashboard 登录密码。
- 创建应用后，打开 **Deployment** 标签页，启用应用 token，并将其存入 CI 系统的 Secrets。
- 将 token 和 Git webhook URL 视为敏感凭据，避免公开或写入日志。

- 在 CI 中使用 HTTPS dashboard URL 和准确的应用名称。
- 使用 CLI 时，传入 `--appToken`，或通过环境变量 `CAPROVER_APP_TOKEN` 提供 token，并指定服务器 URL 和应用名称。
- [GitHub 部署 Action](https://github.com/caprover/deploy-from-github) 使用 `token` input 接收应用 token。

- 如果 token 泄露，请在应用设置中更新或禁用它，并更新 CI Secret。
- 如果部署的镜像位于私有 registry，还需要单独配置镜像拉取凭据。应用 token 不会自动授予 CapRover 服务器访问私有 registry 的权限。

<span id="source-deployments-ci-cd-github-actions"></span>

## GitHub Actions

推荐使用维护中的 [caprover/deploy-from-github](https://github.com/caprover/deploy-from-github)。它支持从源代码、Docker 镜像、预先打包的归档文件及 monorepo 部署。

- 在 CapRover 中启用应用部署 token，并将其保存为 GitHub Actions Secret。
- 配置 Action 的 `server`、`app` 和 `token` input。
- 如果镜像是私有的，请在 [CapRover 的 registry 设置](../registries/index.md)中添加可用于 pull 的凭据。
- Action 成功后，仍应检查实际部署结果和应用健康状态。

<span id="source-deployments-ci-cd-gitlab-ci"></span>

## GitLab CI

在 GitLab CI 中构建镜像并 push 到 GitLab Container Registry，然后让 CapRover 部署这个精确的镜像 tag。这样可以减轻 CapRover 服务器的构建负担。

1. 在 CapRover 中创建应用，并启用[部署 token](index.md)。
2. 在 GitLab CI/CD Variables 中保存 CapRover 的 HTTPS URL、应用名称和 token。将变量设为 Protected；如果 GitLab 允许，也应启用 Masked。
3. 构建镜像并使用提交对应的 tag（例如 `$CI_COMMIT_SHA`）push 到 GitLab Container Registry。
4. 如果镜像是私有的，需要在 CapRover 的[私有 registry 设置](../registries/index.md)中添加 `registry.gitlab.com`、具有读取权限的凭据和正确的镜像路径前缀。GitLab runner 自己能够登录 registry，并不意味着 CapRover 节点也能拉取镜像。
5. 确保 GitLab runner 已正确配置支持 TLS 的 Docker-in-Docker，并能访问证书卷。在包含 Dockerfile 的仓库中添加如下 `.gitlab-ci.yml`：

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

- 将 `CAPROVER_URL`、`CAPROVER_APP`、`CAPROVER_APP_TOKEN` 设置为 GitLab CI/CD Variables，并保护及隐藏 token。
- 如果启用了 GitLab Container Registry，GitLab 会提供 `CI_REGISTRY_*` 及 commit 相关变量。
- 如果发布分支不是 `main`，请相应调整规则。
6. CI job 完成后，检查 CapRover 的镜像 tag 和服务健康状态。CLI 部署成功仅表示 CapRover 接受了更新，仍需确认容器正常运行且 HTTP 端口配置正确。

- 如果 build 无法连接 Docker daemon，请参考 [GitLab Docker-in-Docker runner 配置](https://docs.gitlab.com/ci/docker/docker_in_docker/)。
- 避免在 pipeline 中写入 dashboard 密码，也不要依赖可变的 `latest` 镜像 tag。
- 如果允许在 CapRover 服务器上从源代码构建，也可以使用 GitLab push webhook。

<span id="source-deployments-ci-cd-generic"></span>

## 通用 CI 系统

- 只要 CI 系统能通过 HTTPS 访问 CapRover dashboard 并持有应用的[部署 token](index.md)，就能触发部署。
- 可以部署包含 `captain-definition` 的源码归档，也可以部署服务器能够访问的预构建镜像。

- 可重复、可追踪的部署流程通常是：构建镜像 → 使用不可变的 commit/release 标识打 tag → push 到 registry → 配置 CapRover 的 pull 权限 → 通过 CLI 或 API 部署指定镜像。
- 将应用 token 和 registry 凭据保存在 CI Secrets 中，避免在日志中输出。CapRover 接受部署后，还需要验证应用健康状态。

如果 CI 上传的是源代码，CapRover 服务器会自行执行构建，因此需要足够的内存和磁盘空间。排查问题请参阅[构建与构建日志](../builds-logs.md)。
