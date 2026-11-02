---
id: ports
title: 网络和防火墙端口
slug: /reference/ports
---

| 端口 | 议定书 | 目的 |
| --- | --- | --- |
| 80 | TCP | HTTP 和证书验证 |
| 443 | TCP | HTTPS |
| 3000 | TCP | 初始dashboard设置 |
| 996 | TCP | 如果启用,自办registry |
| 22 | TCP | SSH 或您的配置的 SSH 端口 |
| 2377 | TCP | Swarm管理 |
| 7946 | TCP/UDP | Swarm节点通信 |
| 4789 | UDP | Swarm堵塞交通 |

- 只有SSH,80,443和3000与初始单节点设置相关.
- 将 Swarm 端口限制为信任的集群节点,并在dashboard HTTPS 设置后限制3000.
- App特定发布的TCP/UDP端口需要自己的准入规则.
- 自定义host 端口 : `CAPTAIN_HOST_HTTP_PORT`, `CAPTAIN_HOST_HTTPS_PORT`,以及 `CAPTAIN_HOST_ADMIN_PORT`。见 [服务器环境](server-environment.md).
