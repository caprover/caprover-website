---
id: app-configuration
title: 应用配置
sidebar_label: 应用配置
---

<br/>

## HTTP 设置

这里包含所有与 HTTP 相关的内容。如果你的应用不是 HTTP 应用，可以直接勾选 “Do not expose as web app”。这用于任何非 Web 应用，例如 MongoDB 或 MySQL 这类数据库。

![httpsettings](/img/docs/app-http.png)

默认情况下，你部署的任何 webapp 都会获得一个 Captain 域名，格式为：`appname.root.domain.com`。不过，你也可以给这个应用添加任意多个域名。例如，可以添加 `www.myawesomeapp.com` 和 `myawesomeapp.com`。

还有一些高级选项，例如 Edit Default Nginx config 和 Container HTTP Port，通常不需要修改。

#### 启用 HTTPS

CapRover 内置支持 Let's Encrypt，可以轻松把网站放到安全的 HTTPS 后面，而不必担心 SSL 证书成本（Let's Encrypt 是免费的），也不必处理配置和证书续期。

要为任意域名启用 HTTPS，只需点击 enable HTTPS。几秒钟后就完成了。

启用 HTTPS 后，你可以选择（而且非常建议）强制所有请求使用 HTTPS，也就是拒绝明文不安全的 HTTP 连接，并把它们重定向到 HTTPS。


## 应用配置

这里可以设置运行时配置和参数。

![appconfig](/img/docs/app-vars.png)

### 环境变量

你能为应用设置的最基础配置之一是环境变量。这些变量通常用于传入不放在代码里的数据。例如第三方服务的 API key、数据库连接 URI 等。

你可以在控制台中设置环境变量，并在代码中动态使用，例如 NodeJS 中的 `process.env.VAR_NAME_HERE`，或 PHP 中的 `$_ENV["VAR_NAME_HERE"]`。

如果你想在构建时访问这些变量，可以在 Dockerfile 中使用 ARG 命令。

```
FROM imagename....
ARG VAR_NAME_HERE=${VAR_NAME_HERE}
ENV VAR_NAME_HERE=${VAR_NAME_HERE}

## At this point, "VAR_NAME_HERE" is available as an env var during your build,
## you can do something like this:
## RUN echo $VAR_NAME_HERE
```

除了你自己设置的变量，CapRover 还会设置 `CAPROVER_GIT_COMMIT_SHA` 环境变量，值为正在部署的完整 git commit SHA。它只在 Docker 构建期间可用，默认不会进入应用内部。如果你想在应用中使用它，可以像下面这样：

```
FROM imagename....
ARG CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
ENV CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
```

### 端口映射

CapRover 允许你把容器端口映射到主机。如果你希望应用/容器的某个端口可以从公网访问，就应使用这个功能。最常见的场景是**从本机连接到数据库容器**。

注意，即使你不设置任何端口映射，同一 Captain 集群中的其他容器仍然可以访问所有端口。因此，只有在你希望端口可被公网访问时，才应使用这个选项。同时确保端口已开放，见[防火墙设置](firewall.md)。

例如，如果你希望 NodeJS 应用访问 MongoDB 数据库，并且不需要从笔记本访问 MongoDB，就不需要端口映射。你可以使用 MongoDB 实例的完全限定名，即 `srv-captain--mongodb-app-name`（把 `mongodb-app-name` 替换为你使用的应用名）。

### 持久化目录

仅用于[持久化应用](persistent-apps.md)。

### Node ID

仅用于[持久化应用](persistent-apps.md)。持久化应用需要锁定到特定节点（如果你有服务器集群）。NodeId 定义这个应用应锁定到哪个节点。

### Service Tags

_从 1.11 起可用_

你可以用特殊标签标记 caprover 服务。这样可以更好地在表格中分组和查看应用。

### Instance Count

这个应用应同时运行多少个实例。你可以运行任意多个实例。但会受硬件限制。如果你增加这个数字，却没有足够的 RAM 或磁盘空间，系统可能会崩溃。增加这个数字前，建议先考虑性能影响。

### Predeploy Function

这是一个[非常危险的高级选项](pre-deploy-script.md)。除非你确实知道自己在做什么，否则不要使用。
