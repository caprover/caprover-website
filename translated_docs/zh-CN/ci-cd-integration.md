---
id: ci-cd-integration
title: CI/CD 集成
sidebar_label: 简介
---

虽然 CapRover 可以很容易地构建源码并把它转换成 Docker 镜像，但你常常会发现构建过程非常重。实际上，很多情况下它比应用本身的负载更重。这可能导致你在自己的服务器上构建源码时服务器崩溃。避免这些重负载的最好方法，是在其他地方构建 Docker 镜像，然后只把构建产物部署到 CapRover 服务器。

有许多简单的 CI/CD 平台为构建提供了充足的免费分钟数。例如 GitHub 和 GitLab 都为私有仓库提供免费分钟数，并为公开仓库提供无限免费分钟数。

接下来阅读更多关于 [Github 集成](ci-cd-integration/deploy-from-github.md) 和 [Gitlab 集成](ci-cd-integration/deploy-from-gitlab.md) 的内容。
