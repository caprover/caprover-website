---
id: cloudflare-reverse-proxies
title: 云纹和反向近缘
slug: /domains/cloudflare-reverse-proxies
---

- 对于与 Cloudflare DNS 的初始设置,将通配符 A 记录指向 CapRover 服务器并选择 **仅限 DNS** (没有Cloudflare代理).
- 在请求证书前确认dashboard和样本应用软件在HTTP上的工作.
- 这让CapRover的普通HTTP挑战达到自己的NGINX服务.

- 如果您稍后打开了代理服务器, 请验证其 TLS 模式, 原始 `Host` 标题, WebSocket 处理,缓存行为,以及证书更新路径.
- 终止 HTTPS 代理服务器不会自动加密与 CapRover 的连接 。
- 防止公众请求 `/.well-known/acme-challenge/` 从到达 CapRover 可以中断发行或更新。

关于拥有host 端口80和443的上游反向代理,见 [反向代理场景](../installation/advanced/index.md)。在启用两个层的强制 HTTPS 之前, 配置和测试代理的准确行为 。

## Cloudflare 通用 SSL 和嵌入式应用域

在云层上 **完整 DNS 设置**,通用SSL覆盖 `example.com` 和一级子域,例如 `apps.example.com`确实 **没有** 覆盖更深层的主机名, 如 `my-app.apps.example.com`.

- 如果您的 CapRover 根域是 `apps.example.com`,代理的app子域为深两层.
- 使用 **仅限 DNS** 让 CapRover 在源头处理 HTTPS, 或配置 Cloudflare [TLS / 高级证书共计](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/) 更深层的名字。
- 在Cloudflare部分CNAME设置上,证书行为不同;遵循Cloudflare主机名覆盖规则.

检查 Cloudflare 边缘证书与证书 CapRover 证书的源头 。
