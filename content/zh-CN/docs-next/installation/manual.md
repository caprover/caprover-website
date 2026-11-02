---
id: manual
title: 手动设置
slug: /installation/manual
---

使用此路径将 Docker 和 riottrap CapRover 自己安装到新的 Ubuntu 24.04 服务器上 。

## 1. 港口和防火墙

允许在主机提供者的防火墙中设置下列端口,如果使用UFW,则在服务器上安装:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp   # Dashboard setup
sudo ufw status
```

如果UFW不活动,则启用它 `sudo ufw enable` **之后** 允许SSH。 一旦仪表板在HTTPS上工作,可以限制端口3000. 见 [防火墙](domains/firewall.md) 用于多节点端口。

## 2. 安装嵌入器

在服务器上运行 :

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

如果由于已有软件包而安装失败, 请遵循 [Docker 的 Ubuntu 指南](https://docs.docker.com/engine/install/ubuntu/)。使用 Docker 引擎而不是抓图包。

## 3. 安装CapRover

```bash
sudo docker run -p 80:80 -p 443:443 -p 3000:3000 \
  -e ACCEPTED_TERMS=true \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /captain:/captain \
  caprover/caprover
```

设置完成后, 打开 `http://YOUR_SERVER_IP:3000`.

**初始密码 :** `captain42`

如果仪表板无法到达,请检查 `sudo docker service ls` 和防火墙规则 从步骤1。

继续 [DNS和仪表板设置](../get-started.md#dns).
