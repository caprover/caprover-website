---
id: ports
title: 网络和防火墙端口
slug: /reference/ports
---

| 端口 | 协议 | 用途 |
| --- | --- | --- |
| 80 | TCP | HTTP 和证书验证 |
| 443 | TCP | HTTPS |
| 3000 | TCP | 首次配置 dashboard |
| 996 | TCP | 自托管镜像仓库（启用时） |
| 22 | TCP | SSH，或自定义的 SSH 端口 |
| 2377 | TCP | Docker Swarm 管理通信 |
| 7946 | TCP/UDP | Swarm 节点间通信 |
| 4789 | UDP | Swarm overlay 网络流量 |

- 首次配置单节点服务器，只需 SSH、80、443 和 3000 端口。
- Swarm 相关端口只对可信的集群节点开放。dashboard 通过 HTTPS 正常工作后，限制 3000 端口的公网访问。
- 如果应用单独发布 TCP/UDP 端口，还需要为这些端口配置访问规则。
- 自定义 host 端口使用 `CAPTAIN_HOST_HTTP_PORT`、`CAPTAIN_HOST_HTTPS_PORT` 和 `CAPTAIN_HOST_ADMIN_PORT`。参阅[服务器环境变量](server-environment.md)。
