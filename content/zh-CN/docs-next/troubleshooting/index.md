---
id: index
title: 故障排查
slug: /troubleshooting
---

如果需要收集完整的服务器信息，请使用[诊断工具](diagnostics.md)。

<span id="source-applications-troubleshooting"></span>

## 应用无法访问或返回 HTTP 502

- 检查应用的部署日志和服务日志。
- 确认容器进程监听 `0.0.0.0`，并且 **Container HTTP Port** 与进程监听的端口一致。
- 使用 `docker service ps SERVICE_NAME` 检查任务失败情况。
- 如果数据丢失，请检查数据卷挂载和任务实际运行的节点。

<span id="source-deployments-troubleshooting"></span>

## 部署失败

| 失败阶段 | 检查项目 |
| --- | --- |
| Git fetch | 仓库 URL、分支、部署凭据、网络访问 |
| Build | 第一条构建错误、Dockerfile / `captain-definition`、内存、磁盘 |
| 拉取镜像 | Registry 可用性、镜像 tag、凭据；集群每个节点都需要能够 pull |
| 更新服务 | `docker service ps SERVICE_NAME` 和服务日志 |

<span id="source-domains-troubleshooting"></span>

## DNS、HTTPS 和请求路由

1. **DNS：** 检查域名的 A/AAAA 记录、通配符 DNS 和代理模式。
2. **网络连通性：** 检查公网 `80/tcp`、`443/tcp` 及云服务商防火墙。
3. **HTTP 路由：** 确认容器监听端口和 Docker 任务状态。
4. **证书：** 检查 Certbot 日志及 HTTP-01 验证请求能否到达服务器。
5. **重定向循环：** 检查 Force HTTPS、自定义重定向和上游反向代理。

**域名验证错误 1107：** 确认实际使用的公网域名解析到本服务器，并且可以通过 80 端口访问。仅在私有网络使用时，请参阅[高级安装](../installation/advanced/index.md)中的 `skipVerifyingDomains` 配置。跳过验证不会自动提供 DNS 解析或公网 TLS 证书。

<span id="source-data-persistence-troubleshooting"></span>

## 存储和数据库

- **数据库空闲连接超时：** 配置数据库客户端的连接重试和 keepalive；修改 CapRover 配置前先检查 Docker 网络状态。
- **数据丢失：** 检查容器内挂载路径、实际 Docker volume 或 bind mount 路径，以及任务所在节点。
- **权限错误：** 检查容器 UID、只读标记、目录是否存在及磁盘空间。
- **从外部连接数据库失败：** 检查数据库服务状态、监听地址、认证、已发布的 host 端口和防火墙。
- 排查期间保留数据卷和 host 目录。参阅[备份持久化数据](../data-persistence/backup-data.md)。

<span id="source-scaling-troubleshooting"></span>

## Swarm 和多节点问题

- **节点加入失败：** 检查默认 push registry、SSH 连接、新节点的 Swarm 是否为 inactive，以及节点间端口是否可达。
- **任务 Pending 或反复重启：** 检查 `docker node ls`、`docker service ps SERVICE_NAME`、镜像拉取日志、节点调度限制和可用内存。
- **持久化任务被迁移：** 节点本地数据卷中的数据不会随任务自动移动。
- CapRover 在加入节点时可能修改 UFW 规则，之后请重新确认云服务商防火墙设置。

<span id="source-troubleshooting-support"></span>

## 获取支持

- 使用问题咨询：[GitHub Discussions](https://github.com/caprover/caprover/discussions)
- 可复现的产品缺陷：[GitHub Issues](https://github.com/caprover/caprover/issues)
- 社区交流：[CapRover Slack](https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA)
- 付费咨询：`support@caprover.com`。Pro 订阅相关支持：`pro.support@caprover.com`。

<span id="source-troubleshooting-report-bug"></span>

## 报告 Bug

产品问题请提交到 [CapRover Issues](https://github.com/caprover/caprover/issues)，文档问题请提交到[网站 Issues](https://github.com/caprover/caprover-website/issues)。

提交时请说明版本、Docker/操作系统信息、部署方式、复现步骤、预期和实际结果，并附上脱敏日志。分享前移除所有密码、token、私钥和个人信息。
