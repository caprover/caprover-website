---
id: manual
title: 手动安装
slug: /installation/manual
---

本页面介绍如何在全新的 Ubuntu 24.04 服务器上手动安装 Docker 并启动 CapRover。常规安装建议使用[自动安装脚本](../get-started.md)。

## 1. 端口与防火墙

在云服务商的防火墙中放行所需端口。如果服务器启用了 UFW，也需要运行：

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp   # Dashboard setup
sudo ufw status
```

如果 UFW 尚未启用，请**先确保 SSH 已放行**，再执行 `sudo ufw enable`。管理面板通过 HTTPS 正常工作后，可以限制 3000 端口的公网访问。多节点所需端口参阅[防火墙配置](domains/firewall.md)。

## 2. 安装 Docker

在服务器上执行：

```bash
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker version
sudo docker run --rm hello-world
```

如果已有软件包导致安装失败，请参考 [Docker 官方 Ubuntu 安装指南](https://docs.docker.com/engine/install/ubuntu/)。建议安装 Docker Engine，避免使用 snap 版本。

## 3. 安装 CapRover

```bash
sudo docker run -p 80:80 -p 443:443 -p 3000:3000 \
  -e ACCEPTED_TERMS=true \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /captain:/captain \
  caprover/caprover
```

初始化完成后，打开 `http://YOUR_SERVER_IP:3000`。

**初始密码：**`captain42`

如果管理面板无法访问，请检查 `sudo docker service ls` 的结果和第 1 步的防火墙规则。

接下来按照[DNS 和管理面板配置](../get-started.md#dns)完成设置。
