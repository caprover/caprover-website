---
id: firewall
title: 防火墙
slug: /domains/firewall
---

| 端口 | 访问 |
| --- | --- |
| `80/tcp` | 公共 HTTP 和证书验证 |
| `443/tcp` | 公共 HTTPS |
| `3000/tcp` | 初始dashboard设置; HTTPS 后限制 |
| `996/tcp` | 启用时自托管 registry |
| `2377/tcp` | 信任节点之间的 Swarm 管理 |
| `7946/tcp,udp` | Swarm节点通信 |
| `4789/udp` | Swarm覆盖网络 |

- 在启用UFW前允许SSH. 您的主机供应商的防火墙也必须允许必要的流量。
- 将 Swarm 端口限制为集群节点 。
- Docker公布的端口可以绕过UFW规则. 使用服务商或Docker-aware防火墙规则.

见 [开始](../get-started.md) 和 [端口参考](../reference/ports.md).

<span id="source-domains-public-services"></span>
<span id="source-applications-public-ports"></span>

## 公共 TCP / UDP 端口

- 仅为CapRover的Docker网络以外的客户端发布应用程序端口.
- 在应用程序设置中指定容器端口、host 端口和协议。
- Docker Swarm的 `ingress` 跨节点的模式会转发请求; `host` 模式发布运行任务的节点。
- 通过认证和限制网络访问来保护已曝光的数据库.

<span id="source-domains-internal-networking"></span>

## 内部网络

CapRover的重叠网络上的应用程序可以使用目的地服务名称和端口连接,例如 `database:5432`,而不发布host 端口。 检查实际名称 `docker service ls`;遗留服务可保留 `srv-captain--` 前缀。
