---
id: firewall
title: 防火墙
slug: /domains/firewall
---

| 端口 | 用途 |
| --- | --- |
| `80/tcp` | 公网 HTTP 访问和证书验证 |
| `443/tcp` | 公网 HTTPS 访问 |
| `3000/tcp` | 初次配置 dashboard；启用 HTTPS 后应限制公网访问 |
| `996/tcp` | 自托管 registry，启用后需要 |
| `2377/tcp` | 可信节点之间的 Swarm 管理通信 |
| `7946/tcp,udp` | Swarm 节点间通信 |
| `4789/udp` | Swarm overlay 网络 |

- 启用 UFW 前先放行 SSH。云服务商的防火墙也必须允许所需流量。
- Swarm 相关端口应仅对集群内可信节点开放。
- Docker 发布的端口可能绕过普通 UFW 规则。请使用云服务商防火墙或适用于 Docker 的防火墙规则。

参阅[快速入门](../get-started.md)和[端口参考](../reference/ports.md)。

<span id="source-domains-public-services"></span>
<span id="source-applications-public-ports"></span>

## 公开的 TCP/UDP 端口

- 只有 CapRover Docker 网络外部的客户端需要访问应用时，才发布应用端口。
- 在应用设置中分别指定容器端口、宿主机端口及协议。
- Docker Swarm 的 `ingress` 模式可以跨节点路由流量；`host` 模式只在运行任务的节点上发布端口。
- 对外开放数据库端口时，必须配置身份验证和网络访问限制。

<span id="source-domains-internal-networking"></span>

## 内部网络

连接到 CapRover overlay 网络的应用可以通过目标服务名和端口直接通信，例如 `database:5432`，无需发布宿主机端口。通过 `docker service ls` 确认实际服务名；旧版服务可能仍使用 `srv-captain--` 前缀。
