---
id: index
title: 解决问题
slug: /troubleshooting
---

综合主机报告,使用 [收集诊断](diagnostics.md).

<span id="source-applications-troubleshooting"></span>

## 应用程序不可用或 HTTP 502

- 检查应用的部署和服务日志.
- 确认容器监听 `0.0.0.0` 还有, **容器 HTTP 端口** 匹配进程。
- 检查 `docker service ps SERVICE_NAME` 对于任务失败。
- 对于缺失的数据,请检查配置的音量和主持任务的节点.

<span id="source-deployments-troubleshooting"></span>

## 部署失败

| 失败 | 检查 |
| --- | --- |
| Git 获取 | 仓库 URL,分支,部署证书,网络访问 |
| 构建 | 第一个构建错误, Dockerfile / `captain-definition`内存、磁盘 |
| 镜像拉动 | 记录可用性、镜像标签和证书;集群中的每个节点必须拉动 |
| 服务更新 | `docker service ps SERVICE_NAME` 和服务日志 |

<span id="source-domains-troubleshooting"></span>

## DNS、HTTPS和路由

1. **DNS: NS.** 请检查date=中的日期值 (帮助) 主机名的A/AAAA记录,通配符DNS和代理模式.
2. **可达到性:** 检查公众 `80/tcp` 和 `443/tcp`,包括供应商防火墙。
3. **HTTP 路由 :** 检查容器端口、 听器和 Docker 任务状态 。
4. **证书 :** 检查Certbot日志和HTTP-01可达性.
5. **重定向循环 :** 检查Force HTTPS,自定义重定向和上游代理.

**域校验错误 1107:** 请检查access-date=中的日期值 (帮助) 此服务器的公用主机名是否解决,并在端口80上可以到达. 关于私人网络,见 [高级安装](../installation/advanced/index.md) 联 合 国 `skipVerifyingDomains` 设置。 该覆盖不提供 DNS 或 公共 TLS 证书 。

<span id="source-data-persistence-troubleshooting"></span>

## 储存和数据库

- **闲置数据库连接超时 :** 使用客户端的连接重试和保存设置,并在更改 CapRover 配置前检查Docker网络状态.

- 丢失的数据:检查容器挂载路径, 实际Docker卷或绑载挂载路径, 以及任务调度 。
- 权限错误: 检查容器 UID, 只读标签, 目录存在和磁盘容量 。
- 外部数据库连接失败: 校验内部数据库健康,收听者/认证,发布host 端口和防火墙.
- 在调查期间保留数量和主机路径. 见 [备份持久数据](../data-persistence/backup-data.md).

<span id="source-scaling-troubleshooting"></span>

## Swarm和多节点故障

- **连接失败 :** 确认默认的push registry已配置, SSH 工作, 加入节点的 Swarm 不活动, 信任的节点到节点端口可以到达 。
- **任务待决/重新开始 :** 检查 `docker node ls`, `docker service ps SERVICE_NAME`,镜像拉日志,放置限制和可用的内存.
- **持续任务已移动 :** 关于节点本地卷的数据不会随任务自动移动.
- CapRover在节点加盟期间修改UFW规则后审查供应商防火墙限制.

<span id="source-troubleshooting-support"></span>

## 支助

- [GitHub 讨论](https://github.com/caprover/caprover/discussions) 使用问题
- [GitHub 问题](https://github.com/caprover/caprover/issues) 可复制缺陷
- [CapRover Slack社区](https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA) 社区帮助
- 付费咨询、联系 `support@caprover.com`。Pro订阅者可以使用 `pro.support@caprover.com` 用于订阅支持。

<span id="source-troubleshooting-report-bug"></span>

## 报告错误

使用 [CapRover问题](https://github.com/caprover/caprover/issues) 产品缺陷,或 [网站问题](https://github.com/caprover/caprover-website/issues) 关于文件缺陷。

包含版本,Docker/OS细节,部署方法,复制步骤,预期/实际行为,以及消毒日志. 共享前删除所有密码,令牌,私钥和个人数据.
