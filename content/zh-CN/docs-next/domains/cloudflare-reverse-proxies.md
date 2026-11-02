---
id: cloudflare-reverse-proxies
title: Cloudflare 与反向代理
slug: /domains/cloudflare-reverse-proxies
---

- 初次使用 Cloudflare DNS 安装 CapRover 时，将通配符 A 记录指向服务器并选择 **DNS only**（关闭 Cloudflare 代理）。
- 申请证书之前，先检查 dashboard 和测试应用能否通过 HTTP 正常访问。
- 这样 CapRover 的 HTTP challenge 才能直接到达其 NGINX 服务。

- 如果之后启用代理，请检查 TLS 模式、原始 `Host` header、WebSocket 支持、缓存行为和证书续期路径。
- 代理层终止 HTTPS 并不意味着代理到 CapRover 的连接也已加密。
- 如果重定向或其他规则阻止公网请求访问 `/.well-known/acme-challenge/` 并转发到 CapRover，可能导致证书签发或续期失败。

如果上游反向代理占用了宿主机的 80 和 443 端口，参阅[反向代理部署场景](../installation/advanced/index.md)。在两层都强制 HTTPS 前先测试代理配置。

## Cloudflare Universal SSL 与多级子域名

使用 Cloudflare **full DNS setup** 时，Universal SSL 覆盖 `example.com` 和 `apps.example.com` 这样的一级子域名，但**不会**自动覆盖 `my-app.apps.example.com` 这样的更深层 hostname。

- 如果 CapRover 根域名是 `apps.example.com`，对应的应用域名属于二级子域名。
- 使用 **DNS only**，由 CapRover 在源站提供 HTTPS；或者通过 Cloudflare [Total TLS / advanced certificates](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/) 支持更深层域名。
- Cloudflare partial CNAME 配置可能有不同的证书覆盖行为，应遵循 Cloudflare 的 hostname 覆盖规则。

Cloudflare edge 证书与 CapRover 源站证书应分别检查。
