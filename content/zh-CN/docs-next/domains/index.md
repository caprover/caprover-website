---
id: index
title: 域名与 HTTPS
slug: /domains
---

<span id="source-domains-root-domain"></span>

## 根域名与通配符 DNS

示例根域名：`apps.example.com`。

| 名称 | DNS 记录 | 解析结果 |
| --- | --- | --- |
| `*.apps`（位于 `example.com` DNS 区域） | A → 服务器 IPv4 | `captain.apps.example.com` 和 `my-app.apps.example.com` |
| `apps`（可选） | A → 服务器 IPv4 | `apps.example.com` |

- 将 `apps.example.com` 设置为 CapRover 根域名，不包含 `*.` 或 `captain.`。
- 保持通配符 DNS 指向 CapRover，以支持应用域名和证书续期。
- 使用 Cloudflare 时，初次进行 HTTP-01 证书验证应选择 **DNS only**。参阅[反向代理](cloudflare-reverse-proxies.md)。

<span id="source-domains-app-domains"></span>

## 应用域名

- 应用默认域名为 `<app-name>.<root-domain>`。
- 将 **Container HTTP Port** 设置为应用进程实际监听的端口，并确保进程监听 `0.0.0.0`。
- 作为内部服务运行的 worker 和数据库不需要公网域名。

<span id="source-domains-custom-domains"></span>

## 自定义域名

- 先将 hostname 解析到 CapRover 服务器，再将其绑定到应用。
- 对于 apex domain，可以使用 A 记录或 DNS 服务商提供的别名机制。
- 要正常进行域名重定向和证书续期，源 hostname 必须持续解析到 CapRover。

<span id="source-domains-https"></span>

## HTTPS

CapRover 使用 Certbot 为 dashboard 和各应用 hostname 单独签发证书。

**证书签发要求：**

- hostname 正确解析到目标服务器。
- 公网 `80/tcp` 可以访问 CapRover，以完成 HTTP-01 challenge。
- `443/tcp` 已开放用于 HTTPS。

通配符 DNS 记录**不会**自动提供通配符 TLS 证书。每个 hostname 都需要相应的证书配置。

如果前面使用其他反向代理，应确保 HTTP-01 请求能够转发到 CapRover，或通过[高级 Certbot / ACME](advanced-certbot.md)配置其他验证方式。

<span id="source-domains-certificate-renewal"></span>

## 证书续期

- 修改反向代理、防火墙或服务器后，确保 DNS 和 HTTP-01 challenge 的路由仍然可用。
- 续期失败时，检查 `docker service logs captain-captain --since 24h` 及对应 hostname 的 DNS。
- 已解除绑定的旧证书可能产生警告。较新的 CapRover 版本会尝试清理至少过期 24 小时的孤立证书。手动处理前请确认当前版本的实际行为。
- 保留仍有活动域名使用的证书，并优先修复续期失败的根因。
