---
id: get-started
title: 快速入门
slug: /get-started
---

在全新的 Ubuntu 24.04 服务器上安装 CapRover。

## 系统要求

- AMD64 或 ARM64 服务器，具有公网 IPv4 地址以及 sudo/root 权限。
- 至少 1 GiB 内存和 5 GiB 可用磁盘空间。
- 一个可以配置通配符 DNS 记录的域名。
- 云服务商防火墙允许公网访问 TCP **80**、**443** 和 **3000** 端口。

## 安装 CapRover

在服务器上执行：

```bash
sudo apt update && sudo apt install -y curl
curl -fsSLo caprover-install.sh \
  https://raw.githubusercontent.com/caprover/caprover/master/scripts/user/installer/caprover-install.sh
sudo bash caprover-install.sh --check
sudo bash caprover-install.sh
```

- [安装脚本源码及参数](https://github.com/caprover/caprover/tree/master/scripts/user/installer)。以 root 权限运行之前，请先检查下载的脚本内容。
- `--check`：只读检查操作系统、内存、磁盘、Docker、Swarm、端口以及防火墙冲突。安装前先解决检测到的阻塞问题。
- 如果没有安装 Docker Engine，安装脚本会自动安装，并保留现有的 Docker 工作负载。
- 如果 UFW 防火墙已启用，安装脚本会放行 TCP 80、443 和 3000 端口。脚本不会启用原本未启用的 UFW，也不会修改云服务商的防火墙。
- 安装完成后，脚本会检查端口的外部可达性并显示警告。DNS、管理面板和 HTTPS 仍需要另行配置。

**其他安装方式：** [手动安装](installation/manual.md)（手动执行 Docker 和 CapRover 命令）、[DigitalOcean Marketplace](installation/index.md)，以及适用于私有网络、现有 Swarm 集群或自定义端口的[高级安装](installation/advanced/index.md)。

## DNS

在 DNS 服务商处创建一条 A 记录：

| 类型 | 名称（在 `example.com` 域中） | 值 |
| --- | --- | --- |
| A | `*.apps` | 服务器的公网 IPv4 地址 |

本指南使用 `apps.example.com` 作为 CapRover 的根域名。通配符记录将覆盖 `captain.apps.example.com` 和应用域名，例如 `my-first-app.apps.example.com`。

验证 DNS 解析：

```bash
dig +short captain.apps.example.com
dig +short test.apps.example.com
```

两个命令都应返回服务器的 IP 地址。如果使用 Cloudflare 等 DNS 代理，安装时请选择 **DNS only**（仅 DNS）。只有需要直接使用 `apps.example.com` 时，才需要为这个根主机名单独创建 DNS 记录。

## 配置 CapRover

打开 `http://YOUR_SERVER_IP:3000`。**初始密码：**`captain42`。

- 更改密码，并将根域名设置为 `apps.example.com`（不包含 `*.` 或 `captain.`）。
- 管理面板域名为 `captain.apps.example.com`。确认 DNS 正常且可以签发证书后，启用 HTTPS 和 **Force HTTPS**（强制 HTTPS）。
- 管理面板通过 HTTPS 正常访问后，限制公网对 `3000/tcp` 端口的访问。

如果证书签发失败，请检查 DNS 和 TCP 80/443 端口的入站访问。参阅[域名和 HTTPS](domains/index.md)。

**CLI 替代方案：** 在自己的电脑上运行 `npm install -g caprover` 安装 CLI，然后执行 `caprover serversetup`。参阅 [CLI 命令](reference/cli.md)。

## 部署第一个应用

1. 打开 **Apps**，创建名为 `my-first-app` 的 Web 应用。
2. 在 **Deployment** 中粘贴以下 Captain Definition 并部署：

   ```json
   {
     "schemaVersion": 2,
     "imageName": "nginx:stable-alpine"
   }
   ```

3. 将 **Container HTTP Port** 设置为 `80`。
4. 打开 `http://my-first-app.apps.example.com`。此时应该看到 NGINX 欢迎页面。
5. DNS 和 80 端口可以正常访问后，在应用的 HTTP 设置中配置 HTTPS。

**下一步：** [部署自己的代码](deployments/index.md) · [配置应用](applications/index.md) · [持久化数据](data-persistence/index.md)

## 内存不足时的构建方案（可选）

如果构建因内存不足而失败，请运行 `free -h` 和 `swapon --show` 检查内存和交换空间。如果磁盘有足够空间且 `/swapfile` 尚不存在，可以执行：

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

若要重启后继续启用交换空间，请在 `/etc/fstab` 中**仅添加一次** `/swapfile none swap sw 0 0`。如果经常构建应用，建议增加内存或使用 CI 进行构建。

<span id="source-index"></span>

## 文档导航

按主题查看文档：

- **新安装：** [快速入门](get-started.md)
- **应用及其设置：** [应用](applications/index.md)
- **部署：** [部署](deployments/index.md)
- **服务器维护：** [服务器管理](server/index.md)
- **遇到问题：** [故障排查](troubleshooting/index.md)
