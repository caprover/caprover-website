---
id: how-caprover-works
title: CapRover 工作原理
slug: /fundamentals/how-caprover-works
---

CapRover 在一台或多台服务器上管理 Docker Swarm 服务。

- **CapRover：** 保存应用配置、域名、部署历史和服务器设置。
- **Docker Swarm：** 运行容器、更新服务使用的镜像，并维护指定的副本数量。
- **NGINX：** 根据请求的域名，将 HTTP(S) 流量转发到应用容器的监听端口。
- **Docker registry：** 为集群中的节点提供镜像分发。
- **Docker 数据卷和 bind mount：** 将应用数据保存在可替换的容器之外。

<span id="source-fundamentals-applications-and-services"></span>

## 应用与服务

一个 CapRover 应用对应一个 Docker Swarm 服务。

- Web 应用通常使用 `<app-name>.<root-domain>` 作为默认域名。
- Worker 和数据库可以在不暴露公网 HTTP 路由的情况下运行。
- 使用节点本地存储的有状态应用必须运行在保存数据的节点上。

<span id="source-fundamentals-builds-images-deployments"></span>

## 构建与部署

- 可以部署已有镜像，也可以通过 `captain-definition` 构建镜像。
- 部署时，Swarm 会更新服务并运行指定的镜像。
- **构建成功不代表应用运行正常。** 应用进程仍需监听所配置的容器端口。
- 回滚镜像不会还原环境变量、数据库 schema 或数据卷中的内容。

参阅[部署](../deployments/index.md)和 [Captain Definition](../reference/captain-definition.md)。

<span id="source-fundamentals-networking"></span>

## 网络

- **公网 HTTP 流量：** DNS → CapRover NGINX → 应用容器的 HTTP 端口。
- **容器间通信：** 使用 Swarm 服务名及其内部端口，例如 `postgres:5432`，无需向公网发布数据库端口。
- **其他协议：** 需要显式发布对应 TCP/UDP 端口。参阅[端口参考](../reference/ports.md)。

<span id="source-fundamentals-persistence"></span>

## 数据持久化

- 只写入容器内部的文件可能在重新部署后丢失。
- Docker 数据卷和 bind mount 通常属于**节点本地存储**；Swarm 不会自动复制这些数据。
- 应用数据需要独立备份，不能只依赖 CapRover 配置备份。

参阅[持久化存储](../data-persistence/index.md)。

<span id="source-fundamentals-docker-swarm"></span>

## Docker Swarm

- 即使只有一台服务器，CapRover 也会初始化 Docker Swarm。
- **Managers** 负责管理 Swarm，**workers** 执行调度的任务。
- 多节点部署需要节点间可信网络，以及所有节点都能访问的默认 push registry。参阅[多节点配置](../scaling/multi-node.md)。

<span id="source-reference-glossary"></span>

## 常用术语

| 术语 | 含义 |
| --- | --- |
| `captain-definition` | 指定构建方式或已有镜像的配置文件 |
| 根域名 | 管理面板和应用默认域名使用的 DNS 后缀 |
| 实例 | Docker 服务的一个副本 |
| 持久化目录 | 挂载到应用容器中的 Docker 数据卷或 bind mount |
| One-Click App | 一键部署一个或多个 CapRover 应用的模板 |
