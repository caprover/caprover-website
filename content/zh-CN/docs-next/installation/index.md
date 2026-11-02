---
id: index
title: 安装选项
slug: /installation
---

对于标准的 Ubuntu 服务器,请使用 [自动安装器](../get-started.md)。关于一步一步的Docker和CapRover命令,见 [手动设置](manual.md).

<span id="source-installation-standard-vps"></span>

## 标准VPS

- Ubuntu 24.04,AMD64/ARM64,公共IPv4,root访问,至少1GB RAM.
- 允许SSH, `80/tcp`, `443/tcp`,以及 `3000/tcp` 在提供者防火墙。
- 设置通配符 A 记录(例如, `*.apps.example.com`)到服务器的公开IP.
- 避免通过snap安装多克. 对于已有的 Docker 引擎, 请验证 `sudo docker version` 和 `sudo docker run --rm hello-world`.

<span id="source-installation-digitalocean"></span>

## 数字海洋

- **新鲜的 Ubuntu 滴滴 :** 跟着 [开始](../get-started.md).
- **[CapRover 市场图像](https://marketplace.digitalocean.com/apps/caprover):** Docker和CapRover被预先安装. 继续 [DNS和仪表板设置](../get-started.md#dns).
- **新的数字海洋客户:** [移交注册](https://m.do.co/c/6410aa23d3f3) 任何现有的促销信贷。 报价不尽相同。

相同的防火墙,内存和通配符DNS要求适用于两个选项.

<span id="source-installation-openstack"></span>

## 打开软件包

- 创建 Ubuntu 24.04 实例, 包含 公共/浮动 IPv4、 SSH 密钥、 外部连接和至少 1 GB RAM 。
- 允许SSH, `80/tcp`, `443/tcp`,以及 `3000/tcp` 安全小组和客家防火墙
- 将通配卡DNS指向公共IP. 继续 [开始](../get-started.md).

**旧热模板 :** 这个 [已有模板](https://github.com/caprover/caprover/blob/master/dev-scripts/openstack/single-instance.yml) 包含硬码值和问题网络/安全默认值。 在使用前审查并改正.
