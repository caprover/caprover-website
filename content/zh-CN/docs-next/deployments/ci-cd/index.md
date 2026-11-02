---
id: index
title: 排雷中心/CD
slug: /deployments/ci-cd
---

<span id="source-deployments-ci-cd-deployment-tokens"></span>

## 部署

- 一个应用部署符让自动化在不使用仪表板密码的情况下部署一个CapRover应用.
- 创建应用程序, 打开它 **部署** 选项卡,启用应用程序令牌,并将值复制到您的 CI 系统的秘密商店。
- 将符号和任何 Git Webhook URL 都视为证书 。

- 使用 HTTPS 仪表板 URL 和 CI 中的确切应用名称 。
- 供应 `--appToken` 或设置 `CAPROVER_APP_TOKEN` 在进程环境中,连同服务器 URL 和 app 名称。
- 这个 [GitHub 部署动作](https://github.com/caprover/deploy-from-github) 接受为 `token` 输入。

- 如果令牌被曝光, 在应用程序设置中替换或禁用, 并更新您的 CI 密钥 。
- 给每个部署任务只提供它同样需要的注册证书;一个应用符号不能让 CapRover 服务器访问私人图像注册 。

<span id="source-deployments-ci-cd-github-actions"></span>

## GitHub 动作

使用 [轮渡/调离](https://github.com/caprover/deploy-from-github) 用于覆盖源、Docker图像、已准备好的档案和单列的工作流程。

- 启用应用程序部署令牌并保存在 GitHub 动作密件中 。
- 提供动作的 `server`, `app`,以及 `token` 投入。
- 对于私有图像, 配置注册证书 [翻车](../registries/index.md).
- 在行动成功后,对部署结果进行核查并应用健康技术。

<span id="source-deployments-ci-cd-gitlab-ci"></span>

## GitLab 密码

在 GitLab CI 中建立图像,将其推至 GitLab 集装箱注册处,并将精确的标记部署到 CapRover 。 这使得昂贵的构建远离CapRover服务器.

1. 在 CapRover 创建应用程序并启用其 [部署符号](index.md).
2. 在 GitLab 中, 将 CapRover HTTPS URL, app name, 和符号存储为受保护的 CI/ CD 变量 。 当您可变设置允许时, 请保留此符号 。
3. 使用特定任务标记构建和推动图像, 如 `$CI_COMMIT_SHA` 至GitLab集装箱登记处。
4. 如果该注册图像是私有的,请添加 `registry.gitlab.com`,一个范围读取证书,以及 CapRover 的正确图像前缀 [私人登记处](../registries/index.md)。仅仅运行方认证是不够的。
5. 确保您的 GitLab 运行器以 TLS 证书卷支持 Docker- in- Docker 。 添加这个 `.gitlab-ci.yml` 以 Docker 文件创建仓库 :

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

- 设定 `CAPROVER_URL`, `CAPROVER_APP`,以及 `CAPROVER_APP_TOKEN` 作为 GitLab CI/CD 变量; 保护和遮盖符号。
- GitLab 供应 `CI_REGISTRY_*` 并在启用集装箱登记册时输入变量。
- 替换 `main` 如果你的释放分支不同。
6. CapRover 任务成功后验证图像标签和服务健康 。 一个成功的CLI部署意味着CapRover接受了更新;应用程序仍然需要一个健康的容器和正确的HTTP端口.

- 见 [GitLab 的 Docker- in- Docker 跑车设置](https://docs.gitlab.com/ci/docker/docker_in_docker/) 如果构建无法连接到 Docker 守护进程。
- 避免嵌入仪表板密码或可变密码 `latest` 管道中的图像标记 。
- GitLab 推推 Webhook 是另一个选项, 当从源头在 CapRover 上构建是可以接受的。

<span id="source-deployments-ci-cd-generic"></span>

## 常规 CI

- 任何CI系统都可以部署到CapRover,如果它能通过HTTPS到达仪表板并持有应用程序 [部署符号](index.md).
- 选择一个包含 `captain-definition` 或服务器可访问的预建图像。

- 最简单的可重复释放流是: 构建一个图像,用一个不可改变的承诺或释放标识符标记它,将其推向一个注册,授权CapRover来拉,然后使用CLI或API来部署准确的图像.
- 将应用符号和注册证书保存在CI秘密商店,避免在日志中打印,并在CapRover接受部署后验证最终应用健康.

如果CI发送源,则CapRover服务器执行构建,需要足够的内存和磁盘. 见 [构建和构建日志](../builds-logs.md) 用来解决问题的
