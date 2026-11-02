---
id: index
title: 缩放可用性( A)
slug: /scaling
---

<span id="source-scaling-scale-app"></span>

## 复制品

- **实例计数** 控制请求的 Swarm 服务任务数量。
- 缩放代码和背景工作支持同时执行的无国籍应用程序。
- 检查 CPU、 RAM、 数据库连接限制和任务状态 `docker service ps SERVICE_NAME`.

<span id="source-scaling-zero-downtime"></span>

## 滚动部署和体检

- 无国籍应用程序一般使用Docker Swarm **启动** 更新。
- 带有挂载数据用途的应用程序 **第一站点** 默认更新,以防止同时写入 。
- 有意义的健康检查有助于Swarm确定准备状态:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/health || exit 1
```

使用您图像中包含的实际准备端点和命令 。 能力,依赖性和应用程序行为仍然决定更新是否无中断.

<span id="source-scaling-placement"></span>

## 职位安排

- 根据制约因素和能力,Swarm将无国籍任务排到现有节点之间。
- CapRover 将持久性的应用程序标注在托管本地数据的节点上.
- 检查任务待决时的登记册访问、节点可用性和放置限制。

<span id="source-applications-scaling-placement"></span>

## 状态缩放

- 本地卷和绑定挂载不会自动在节点之间共享.
- 避免强迫多个作者反对同一本地数据. 对于 **启动** 在国有服务方面,应用程序和存储必须明确支持。
- 移动持续应用程序前迁移数据 。 见 [持久性储存](../data-persistence/index.md) 和 [多节点设置](multi-node.md).
