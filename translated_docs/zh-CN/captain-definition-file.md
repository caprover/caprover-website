---
id: captain-definition-file
title: Captain Definition 文件
sidebar_label: Captain Definition 文件
---

<br/>
## 基础
CapRover 的关键组件之一是位于项目根目录的 `captain-definition` 文件。对于 NodeJS 应用，它和 package.json 放在一起；对于 PHP，它和 index.php 放在一起；对于 Python 应用，它和 requirements.txt 放在一起。它是一个简单的 JSON，例如：


```
 {
  "schemaVersion": 2,
  "templateId": "node/8.7.0"
 }
```


`schemaVersion` 始终是 2。`templateId` 定义运行应用所需的基础环境。格式是 `LANGUAGE/VERSION`。LANGUAGE 可以是：`node`、`php`、`python-django`、`ruby-rack`。VERSION 是你要使用的语言版本，见[下面](#versions-for-templateid)。

注意，虽然 `templateId` 可以是这 4 种最常见的 Web 应用语言：NodeJS、PHP 和 Python/Django、Ruby/Rack，但你并不局限于这些预定义语言。CapRover 允许你定义自己的 Dockerfile。使用自定义 Dockerfile，你可以部署任意语言，Go、Java、.NET，都可以。Dockerfile 写起来相当简单。例如，下面两个 captain-definition 文件会生成<b>完全相同的结果</b>。

#### 简单版本

```
 {
  "schemaVersion": 2,
  "templateId": "node/8.7.0"
 }
```


#### 高级版本

```
 {
  "schemaVersion": 2,
  "dockerfileLines": [
                        "FROM node:8.7.0-alpine",
                        "RUN mkdir -p /usr/src/app",
                        "WORKDIR /usr/src/app",
                        "COPY ./package.json /usr/src/app/",
                        "RUN npm install && npm cache clean --force",
                        "COPY ./ /usr/src/app",
                        "ENV NODE_ENV production",
                        "ENV PORT 80",
                        "EXPOSE 80",
                        "CMD [ \"npm\", \"start\" ]"
                    ]
 }
```
## 在 captain-definition 中使用 Dockerfile：

注意，带 `templateId` 的简单 `captain-definition` 适合作为起点。但随着项目变复杂，你可能想对基础镜像执行更复杂的任务，例如安装 PHP 扩展、安装 `uWSGI`、安装特定版本的 `curl` 等。这时可以使用 Dockerfile。自定义 Dockerfile 可以构建非常定制化的基础镜像。如果你不熟悉 Docker，可以用搜索找到接近需求的内容，再按需调整。如果卡住了，欢迎在 Slack 频道或 StackOverflow 提问。


要使用仓库中的 Dockerfile，只需在 captain-definition 文件中引用它：

```
 {
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile"
 }
```

Dockerfile 简单且容易阅读。即使你完全不了解 Docker，也能大致看懂它在做什么。一些高级方法示例：[PHP Composer](https://github.com/githubsaturn/captainduckduck/issues/94) 和 [Meteor](https://github.com/githubsaturn/meteor-captainduckduck/blob/master/captain-definition)

使用这种方法（纯 Dockerfile），你可以部署 Ruby、Java、Scala，几乎任何东西。需要更多 Dockerfile 细节时，见 [Dockerfile Help](https://docs.docker.com/engine/reference/builder) 和 [Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices)。

## 使用镜像名称

如果你是高级 Docker 用户，可能知道 DockerHub 上有大量预构建应用。你可以通过 captain-definition 部署这些镜像。例如要部署 https://hub.docker.com/r/nginxdemos/hello/，使用：

```
 {
  "schemaVersion": 2,
  "imageName": "nginxdemos/hello"
 }
```

提示：你可以直接把上面的 captain-definition 文件复制粘贴到 CapRover Web 控制台的部署页。


## Monorepo：
你可以用一个 git 仓库部署多个不同应用。例如，一个仓库里可能同时有 frontend 和 backend。这时可以定义多个 `captain-definition` 文件，并让它们分别部署不同应用，例如这样的目录结构：
```
/project
   /frontend
      /src/index.js
      package.json
   /backend
      /src/index.js
      package.json
captain-definition-backend
captain-definition-frontend
```
内容如下：
`captain-definition-backend`
```
 {
  "schemaVersion": 2,
  "dockerfileLines": [
                        "FROM node:12-alpine",
                        "RUN mkdir -p /usr/src/app",
                        "COPY ./backend /usr/src/app",
                        "RUN npm install && npm cache clean --force",
                        "CMD [ \"npm\", \"start\" ]"
                    ]
 }
```
你也可以指向一个 Dockerfile。注意构建上下文始终是项目根目录，所以在 Dockerfile 中必须指向那个特定目录，例如 `COPY ./backend /usr/src/app`

接下来，你需要让 CapRover 为每个应用使用正确的 `captain-definition`。打开应用，进入 DEPLOYMENT 标签，把 captain-definition 路径改成 `./captain-definition-backend`

## templateId 的版本：
注意：版本会在运行时从官方仓库拉取，因此你不需要更新 Captain 就能使用新版本的 NodeJS。例如见[这里](https://hub.docker.com/_/node/)。

**重要：** 下面列出的版本**仅供参考**。例如，生成本文档时 Node 10 还不可用，但现在已经可用。因此，即使下面没有提到，你也可以使用 `node/10`、`node/10.15` 或 `node/10.15.0` 作为 templateId。


```bash
node/
carbon, 8, 8.9, 8.9.4, boron, 6, 6.12, 6.12.3, 9, 9.3, 9.3.0, 8.9.3, 9.2, 9.2.1, argon, 4, 4.8, 4.8.7, 6.12.2, 8.9.2, 6.12.1, 4.8.6, 6.12.0, 8.9.1, 9.2.0, 9.1, 9.1.0, 8.9.0, 9.0, 9.0.0, 4.8.5, 6.11, 6.11.5, 8.8, 8.8.1, 8.8.0, 8.7, 8.7.0, 6.11.4, 8.6, 8.6.0, 8.5, 8.5.0, 4.8.4, 6.11.3, 6.11.2, 7, 7.10, 7.10.1, 8.4, 8.4.0, 8.3, 8.3.0, 8.2, 8.2.1, 6.11.1, 8.2.0, 8.1, 8.1.4, 4.8.3, 6.11.0, 8.1.3, 8.1.2, 8.1.1, 8.1.0, 8.0, 8.0.0, 6.10, 6.10.3, 7.10.0, 4.8.2, 6.10.2, 7.9, 7.9.0, 7.8, 7.8.0, 4.8.1, 6.10.1, 7.7, 7.7.4, 4.8.0, 6.10.0, 7.7.3, 7.7.2, 7.7.1, 7.7.0, 7.6, 7.6.0, 4.7, 4.7.3, 6.9, 6.9.5, 7.5, 7.5.0, 4.7.2, 6.9.4, 7.4, 7.4.0, 4.7.1, 6.9.3, 7.3, 7.3.0, 6.9.2, 4.7.0, 7.2.1, 7.2, 4.6, 4.6.2, 7.2.0, 6.9.1, 7.1, 7.1.0
```

```bash
php/
7, 7.2, 7.2.1, 7.0, 7.0.26, 7.1, 7.1.12, 5, 5.6, 5.6.32, 7.2.0, rc, 7.2-rc, 7.2.0RC6, 7.0.25, 7.1.11, 7.2.0RC5, 7.2.0RC4, 5.6.31, 7.0.24, 7.1.10, 7.2.0RC3, 7.1.9, 7.0.23, 7.2.0RC2, 7.2.0RC1, 7.0.22, 7.1.8, 7.2.0beta3, 7.2.0beta2, 7.1.7, 7.2.0beta1, 7.0.21, 7.2.0alpha3, 5.6.30, 7.0.20, 7.1.6, 7.1.5, 7.0.19, 7.0.18, 7.1.4, 7.0.17, 7.1.3, 7.0.16, 7.1.2, 7.1.1, 7.0.15, 5.6.29, 7.0.14, 7.1.0, 5.6.28, 7.0.13, 7.1-rc, 7.1.0RC6, 7.1.0RC5, 7.0.12, 5.6.27, 7.1.0RC4, 7.1.0RC3, 5.6.26, 7.0.11, 7.1.0RC2, 5.6.25, 7.0.10, 7.1.0RC1, 5.6.24, 7.0.9, 5.5.38, 5.5, 5.5.37, 5.6.23, 7.0.8, 5.5.36, 5.6.22, 7.0.7, 7.0.6, 5.6.21, 5.5.35, 7.0.5, 5.6.20, 5.5.34, 7.0.4, 5.6.19, 5.5.33, 7.0.3, 5.6.18, 5.5.32, 7.0.2, 5.6.17, 5.5.31, 7.0.1, 5.6.16, 5.5.30, 7.0.0, 5.4, 5.4.45, 7.0.0RC8, 5.6.15, 7.0.0RC7, 7.0.0RC6, 7.0.0RC5, 5.6.14, 7.0.0RC4, 7.0.0RC3, 5.6.13, 5.5.29, 7.0.0RC2, 7.0.0RC1, 7.0.0beta3, 5.6.12, 5.5.28, 5.4.44, 7.0.0beta2, 5.6.11, 5.5.27, 5.4.43, 7.0.0beta1, 5.5.21, 5.5.19, 5.5.16, 5.4.40, 5.4.41, 5.4.39, 5.5.17, 5.6.3, 5.6.0, 5.6.8, 5.6.4, 5.4.42, 5.5.20, 5.4.38, 5.5.22, 5.6.5, 5.6.2, 5.4.35, 5.4.36, 5.4.33, 5.3.29, 5.3, 5.5.26, 5.5.18, 5.4.32, 5.4.37, 5.6.1, 5.6.6, 5.6.9, 5.6.10, 5.4.34, 5.6.7, 5.5.24, 5.5.23, 5.5.25
```

```bash
python-django/
2, 2.7, 2.7.14, 3, 3.6, 3.6.4, 3.6.3, rc, 3.7-rc, 3.7.0a3, 3.7.0a2, 3.7.0a1, 2.7.13, 3.6.2, 3.6-rc, 3.6.2rc2, 3.6.1, 3.6.2rc1
```

```bash
ruby-rack/
2.4, 2.4.3, 2, 2.5, 2.5.0, rc, 2.5-rc, 2.5.0-rc1, 2.4.2, 2.5.0-preview1
```
