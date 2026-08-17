---
id: zero-downtime
title: 零停机部署
sidebar_label: 零停机
---

#### 示例：

如果你更喜欢通过示例学习，见[这个 github 仓库](https://github.com/caprover/zero-downtime-example)。

这个仓库包含一个需要 15 秒才能启动的示例应用。但在任何 CapRover 实例上部署这个应用时，你都不会看到 502 错误。

记住，创建应用时，**不要**勾选 “persistent data” 复选框。

### 理解这个挑战

在部署过程中，当新的 Docker 镜像正在滚动发布时，可能会出现短暂的服务中断（部署期间的 502 错误）。这通常是因为新容器可能需要一些时间（例如 30 秒）才能完全可用。在此期间，如果服务收到流量，Nginx 可能返回 502 Bad Gateway 错误，表示它无法从后端服务获得响应。

### Docker Health Checks 的作用

Docker health checks 是一个重要功能，有助于减少部署导致的停机。它们允许你在 Dockerfile 中指定一条命令，定期检查容器健康状态。Docker 随后会根据这个状态管理容器生命周期。

### 在 CapRover 中实现 Health Checks

要把 health checks 集成进 CapRover 部署流程，按这些步骤操作：

**第 1 步：** 在 Dockerfile 中定义 Health Check
修改 Dockerfile，加入 `HEALTHCHECK` 指令。这条指令告诉 Docker 如何测试容器是否仍在正常工作。它可以是检查容器内部状态的命令，也可以是向 HTTP 端点发出请求。

```dockerfile
HEALTHCHECK --interval=30s --timeout=30s --retries=3 \
 CMD curl -f http://127.0.0.1:3000/ || exit 1
```

在这个例子中，curl 每 30 秒请求容器的根 URL。如果 curl 连续超过三次以非零状态退出（由
`--retries` 定义），容器就会被视为 unhealthy。

**第 2 步：** 在 CapRover 中部署并配置
更新 Dockerfile 后，通过 CapRover 部署应用。该平台使用 Docker Swarm，会识别 health check 指令并据此管理部署。

在 Docker Swarm 下，CapRover 的默认行为是等待新容器通过 health check，然后再把流量路由到它。这可以有效避免把请求路由到尚未准备好处理请求的容器，从而防止 502 错误。

### 什么情况下无效？

如果你的应用不使用卷，CapRover 在更新容器时使用 `start-first` 策略。这意味着新版本容器会先启动并运行，然后才停止旧容器。这应能让你获得接近零停机。

这个策略有意不应用于挂载了卷的应用。因为如果同一个服务的多个实例尝试访问同一个文件，会导致数据损坏和失败。对于带卷（**持久化数据**）的应用，CapRover 使用 `stop-first` 策略。这意味着先停止旧容器，再启动新容器。这会导致一定程度的停机。

如果你的应用有持久化数据，你仍然可以强制使用 `start-first` 策略，但要记住，这可能导致数据损坏，因为新旧容器可能同时写入同一个文件。如果你仍想这样做，只需在 [service override](service-update-override.md) 中输入：

```yaml
UpdateConfig:
  Parallelism: 2
  Delay: 1000000000
  FailureAction: pause
  Monitor: 15000000000
  MaxFailureRatio: 0.15
  Order: start-first
```
