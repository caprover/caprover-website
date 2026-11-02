---
id: index
title: 域和 HTTPS
slug: /domains
---

<span id="source-domains-root-domain"></span>

## 根域和通配符 DNS

示例根域 : `apps.example.com`.

| 名称 | 记录 | 结果 |
| --- | --- | --- |
| `*.apps` 输入 `example.com` 区域 | A — 服务器 IPv4 | `captain.apps.example.com` 和 `my-app.apps.example.com` |
| `apps` (可选) | A — 服务器 IPv4 | 裸体 `apps.example.com` |

- 输入 `apps.example.com` 作为 CapRover 的根域, 不包含 `*.` 或 `captain.`.
- 保持通配符 DNS 指向 CapRover 用于应用域和证书更新 。
- 云旗后面,请使用 **仅限 DNS** HTTP-01 证书初步验证期间。 见 [反转代理](cloudflare-reverse-proxies.md).

<span id="source-domains-app-domains"></span>

## App 域

- 默认应用域 : `<app-name>.<root-domain>`.
- 设定 **集装箱 HTTP 端口** 到你的应用程序的监听端口。 应用程序必须绑定 `0.0.0.0`.
- 属于私人服务的工人和数据库不需要公共领域。

<span id="source-domains-custom-domains"></span>

## 自定义域

- 将主机名指向 CapRover 服务器,然后将其附加到应用程序中.
- 对于顶级域,使用A记录或DNS提供者支持的别名机制.
- 域重定向和证书更新取决于源主机名继续解决到CapRover.

<span id="source-domains-https"></span>

## HTTPS 密码

CapRover使用Certbot为单个仪表板和app主机名颁发证书.

**证书先决条件 :**

- 主机名解决到正确的服务器 。
- 公开 `80/tcp` 到达CapRover进行HTTP-01挑战.
- `443/tcp` 为 HTTPS 打开。

通关卡 DNS **没有** 创建通配符 TLS 证书。 每个主机名需要适当的证书处理 。

在外部反向代理后,将 HTTP-01 验证请求传递给 CapRover 或配置一个通过 [高级证书/ ACME](advanced-certbot.md).

<span id="source-domains-certificate-renewal"></span>

## 证书续签

- 保持DNS和HTTP-01挑战路由在代理,防火墙和服务器更改后工作.
- 如果失败, 检查 `docker service logs captain-captain --since 24h` 和受影响的主机名的 DNS.
- 旧的未附证书可以生成警告 。 最近的CapRover版本试图在孤儿证书过期至少24小时后将其删除. 在干预前确认您的版本
- 保存活动域使用的证书; 在源头固定更新失败 。
