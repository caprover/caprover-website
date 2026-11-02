---
id: deploy-databases
title: 部署数据库
slug: /data-persistence/deploy-databases
---

- 在 CapRover 中，数据库作为应用运行，需要持久化存储、登录凭据，以及供客户端连接的网络路径。
- 可以通过 [One-Click Apps](../one-click-apps/index.md) 安装支持的数据库，也可以自行部署数据库镜像。

1. 选择数据库类型和镜像版本。创建应用时启用 **Has Persistent Data**，并选中 **Do not expose as web app**；数据库通常不需要通过 NGINX 提供 HTTP 服务。
2. 在应用配置或 One-Click 安装向导中设置数据库用户名、密码和数据库名称。使用独立的强凭据，不要将其提交到代码仓库。
3. 将命名卷或 bind mount 挂载到数据库镜像实际使用的数据目录，并让应用运行在保存该数据的节点上。
4. 部署后查看 service 日志，等待数据库报告已经就绪。执行一次重启或重新部署，确认数据仍然存在。
5. 其他应用可以通过数据库的 service 名称和容器内部端口连接。只有外部客户端确实需要访问时才发布宿主机端口；防火墙和安全设置参阅[外部连接指南](deploy-databases.md)。
6. 定期执行数据库专用备份并测试恢复。CapRover 配置备份不包含数据库记录。

不同数据库镜像的数据目录和初始化变量可能不同。请以所选 PostgreSQL、MySQL、Redis 或其他镜像的文档为准。

<span id="source-data-persistence-internal-databases"></span>

## 在 CapRover 内部连接数据库

- 连接到 CapRover overlay 网络的应用，可以通过 service 名称和容器端口访问数据库。
- 例如，数据库应用名为 `postgres` 时，PostgreSQL 客户端可使用主机名 `postgres`、端口 `5432`，并提供对应数据库名、用户名和密码。

- 在 Web 应用中，可以将 `DATABASE_URL` 设置为数据库 driver 支持的连接字符串。
- 保存应用设置后，执行一条查询验证连接。
- 无需将数据库端口发布到公网。
- 从 CapRover 1.15 以前版本升级的应用，可能仍保留 `srv-captain--` service 名称或网络别名。如果无法解析主机名，请检查实际 service 名称。

- 将凭据保存在应用环境变量或适当的 secrets 管理机制中，并确保数据库启用了持久化存储及备份。
- 如果还未安装数据库，请先阅读[部署数据库](deploy-databases.md)。

<span id="source-data-persistence-external-databases"></span>

## 从 CapRover 外部连接数据库

- 如果客户端同样部署在 CapRover 中，应优先使用内部服务连接。
- 对外部客户端，先评估是否需要发布受限端口，或者通过隧道提供访问，避免直接向互联网开放数据库。

### 准备数据库

- 将数据库部署为启用持久化、且无需公开 Web 端口的应用。
- 配置数据卷或 bind mount、数据库凭据和数据库名称。
- 查看 service 日志，确认数据库已经就绪；再从另一台 CapRover 应用测试通过 service 名称和内部端口连接。
- 单独备份数据库数据，不能只依赖 CapRover 配置备份。

### 发布受限端口

- 在数据库应用的 **App Config** 中，将一个宿主机端口，例如 `12345/tcp`，映射到数据库容器端口，例如 PostgreSQL 的 `5432/tcp`。
- 保存设置并确认 service update 成功。
- 从外部客户端使用 `SERVER_PUBLIC_IP:12345` 和数据库用户名、密码连接。

- 在云服务商防火墙中，**仅允许需要访问的客户端 IP** 连接 `12345/tcp`。
- 同时检查宿主机防火墙：Docker 发布端口可能绕过普通 UFW 限制。
- 对多节点集群，应明确选择 ingress 或 host 发布模式，并验证实际接收连接的节点。
- 如果流量经过不可信网络，请启用数据库协议支持的 TLS 和强身份验证。端口映射本身不提供加密。

### 尽量使用私有连接

- VPN 或能够访问 CapRover overlay 网络的隧道，可以避免向公网广泛开放数据库端口。
- 仅能通过 SSH 登录宿主机，不代表宿主机一定能解析或访问 Docker 内部 service 名称。
- 隧道入口必须能够访问 overlay 网络；使用前请验证网络位置和访问控制。

连接成功后，从预期的外部客户端测试，移除临时开放的防火墙规则，并记录端口、允许访问的客户端、凭据负责人、备份及下线方案。
