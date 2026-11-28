---
id: index
title: 扩容与可用性
slug: /scaling
---

<span id="source-scaling-scale-app"></span>

## 副本数量

- **Instance Count** 控制 Docker Swarm 服务预期运行的任务数量。
- 只有代码和后台任务支持并发执行的无状态应用，才适合直接增加副本。
- 使用 `docker service ps SERVICE_NAME` 查看任务状态，同时关注 CPU、内存和数据库连接数限制。

<span id="source-scaling-zero-downtime"></span>

## 滚动部署与健康检查

- 无状态应用通常使用 Docker Swarm 的 **start-first** 更新策略。
- 挂载持久化数据的应用默认使用 **stop-first**，避免新旧实例同时写入。
- 合理的健康检查可以帮助 Swarm 判断应用是否就绪：

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/health || exit 1
```

请使用真正反映服务就绪状态的 endpoint，并确保镜像中包含健康检查命令。升级是否能做到零停机，还取决于资源容量、依赖服务和应用本身的行为。

<span id="source-scaling-placement"></span>

## 节点调度

- Swarm 根据节点资源和调度约束，在可用节点之间分配无状态服务的任务。
- 对使用本地存储的持久化应用，CapRover 会将任务固定到数据所在节点。
- 如果任务一直处于 pending 状态，请检查 registry 访问权限、节点可用性和调度约束。

<span id="source-applications-scaling-placement"></span>

## 有状态服务扩容

- 本地数据卷和 bind mount 不会自动跨节点共享。
- 避免多个副本同时写入同一份本地数据。只有应用和存储都明确支持并发写入时，才能对有状态服务使用 **start-first**。
- 移动持久化应用之前先迁移数据。参阅[持久化存储](../data-persistence/index.md)和[多节点部署](multi-node.md)。
