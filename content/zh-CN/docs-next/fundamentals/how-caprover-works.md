---
id: how-caprover-works
title: CapRover 是如何工作的
slug: /fundamentals/how-caprover-works
---

CapRover管理一个或多个服务器上的Docker Swarm服务.

- **队长:** 存储应用程序配置,域,部署历史和设置.
- **Docker Swarm:** 启动容器,更新服务镜像并维护所请求的复制品.
- **NGINX: (英语).** 通过主机名向一个应用程序的容器端口传输 HTTP( S) 路由 。
- **嵌入器注册 :** 在集群中向节点分配镜像。
- **卷和bind mount:** 在可替换容器外保存应用数据。

<span id="source-fundamentals-applications-and-services"></span>

## 应用与服务

一个CapRover应用地图到一个Docker Swarm服务.

- 一个网络应用程序通常得到 `<app-name>.<root-domain>`.
- worker和数据库可以在没有公共HTTP路由的情况下运行.
- 使用本地存储的国有应用程序必须留在持有该数据的节点上.

<span id="source-fundamentals-builds-images-deployments"></span>

## 构建与部署

- 使用 : `captain-definition`.
- 部署更新 Docker 服务以运行该镜像 。
- 一个成功的镜像构建 **没有** 保证一个健康的应用。 进程必须在配置的容器端口上监听 。
- 镜像回滚不恢复环境变量,数据库计划或卷内容.

见 [部署](../deployments/index.md) 和 [Captain Definition](../reference/captain-definition.md).

<span id="source-fundamentals-networking"></span>

## 网络

- **公共网络流量 :** DNS → CapRover NGINX → app的HTTP端口.
- **国内交通:** Swarm服务名称和内部端口,例如 `postgres:5432`,而不发布数据库端口。
- **其他协议:** 明确发布TCP/UDP端口. 见 [端口参考](../reference/ports.md).

<span id="source-fundamentals-persistence"></span>

## 持久化

- 只写在容器内的数据可以在重新部署时消失.
- 堆积和绑定的挂载一般 **节点本地**. Swarm 不复制它们的数据。
- 从CapRover自己的配置中单独备份应用数据.

见 [持久化储存](../data-persistence/index.md).

<span id="source-fundamentals-docker-swarm"></span>

## Docker Swarm

- CapRover甚至为单节点安装初始化一个Swarm.
- **manager 节点** 控制Swarm; **worker 节点** 执行指派的任务。
- 多节点设置需要信任的节点间网络和可达的默认 pushregistry. 见 [多节点设置](../scaling/multi-node.md).

<span id="source-reference-glossary"></span>

## 术语

| 任期 | 含义 |
| --- | --- |
| `captain-definition` | 构建或镜像选择文件 |
| 根域 | dashboard和默认应用域所用的 DNS 后缀 |
| 实例 | Docker 服务的复制件 |
| 持久化目录 | 嵌入卷或绑在应用程序内 |
| 单击App | 应用一个或多个 CapRover 应用程序的模板 |
