---
id: index
title: 安装方式
slug: /installation
---

标准 Ubuntu 服务器建议使用[自动安装脚本](../get-started.md)。如果希望手动执行 Docker 和 CapRover 的安装命令，请参考[手动安装](manual.md)。

<span id="source-installation-standard-vps"></span>

## 标准 VPS

- Ubuntu 24.04、AMD64 或 ARM64、公网 IPv4、root 权限，以及至少 1 GB 内存。
- 在云服务商防火墙中放行 SSH、`80/tcp`、`443/tcp` 和 `3000/tcp`。
- 将通配符 A 记录（例如 `*.apps.example.com`）指向服务器公网 IP。
- 避免安装 snap 版本的 Docker。若已有 Docker Engine，使用 `sudo docker version` 和 `sudo docker run --rm hello-world` 验证。

<span id="source-installation-digitalocean"></span>

## DigitalOcean

- **全新的 Ubuntu Droplet：**按照[快速入门](../get-started.md)安装。
- **[CapRover Marketplace 镜像](https://marketplace.digitalocean.com/apps/caprover)：**Docker 和 CapRover 已经预装，继续完成 [DNS 与 dashboard 配置](../get-started.md#dns)。
- **DigitalOcean 新用户：**可以通过[推荐注册链接](https://m.do.co/c/6410aa23d3f3)查看目前是否有可用推广赠金，具体优惠可能变化。

这两种安装方式都需要满足相同的防火墙、内存和通配符 DNS 要求。

<span id="source-installation-openstack"></span>

## OpenStack

- 创建 Ubuntu 24.04 实例，配置公网或 floating IPv4、SSH key、出站网络和至少 1 GB 内存。
- 在 security group 和系统防火墙中放行 SSH、`80/tcp`、`443/tcp` 和 `3000/tcp`。
- 将通配符 DNS 指向公网 IP，然后按照[快速入门](../get-started.md)继续配置。

**旧版 Heat 模板：**现有[模板](https://github.com/caprover/caprover/blob/master/dev-scripts/openstack/single-instance.yml)包含硬编码值和不安全的网络配置。使用前请仔细检查并修正。
