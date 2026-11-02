---
id: get-started
title: 开始
slug: /get-started
---

在新的Ubuntu 24.04服务器上安装 CapRover.

## 所需经费

- AMD64或ARM64服务器,公共IPv4,sudo/root访问.
- 至少1个GiB RAM和5个GiB自由磁盘空间.
- 一个带有通配符DNS访问权限的域.
- 公共入境TCP端口 **80**, **443**,以及 **3000** 由您的托管提供者允许 。

## 安装 CapRover

在服务器上:

```bash
sudo apt update && sudo apt install -y curl
curl -fsSLo caprover-install.sh \
  https://raw.githubusercontent.com/caprover/caprover/master/scripts/user/installer/caprover-install.sh
sudo bash caprover-install.sh --check
sudo bash caprover-install.sh
```

- [安装器源和选项](https://github.com/caprover/caprover/tree/master/scripts/user/installer)。在将下载的脚本作为 root 运行之前,先审查该脚本。
- `--check`:只读检查OS,RAM,磁盘,Docker,Swarm,端口和防火墙冲突. 在安装前先解决阻碍问题。
- 安装者在没有时安装多克引擎,并保留现有的多克工作量.
- 在活跃的UFW防火墙上,它允许TCP 80/443/300. 它使闲置的UFW和主机提供者防火墙保持不变.
- 安装后,它检查外部的港口可到达性并报告警告。 DNS,仪表板配置,以及HTTPS仍然保持手动状态.

**其他方法:** [手动设置](installation/manual.md) (Docker和CapRover命令), [数字海洋市场](installation/index.md),或 [高级安装](installation/advanced/index.md) 用于私人网络、现有的Swarars和定制端口。

## DNS 数据

在您的 DNS 提供者中创建记录 :

| 类型 | 名称( 在 `example.com`) | 数值 |
| --- | --- | --- |
| A | `*.apps` | 您服务器的 IPv4 公开地址 |

本指南使用 `apps.example.com` 作为 CapRover 根域。 通配符盖 `captain.apps.example.com` 应用域,例如 `my-first-app.apps.example.com`.

校验 DNS :

```bash
dig +short captain.apps.example.com
dig +short test.apps.example.com
```

两者都应该归还您的服务器的IP. 如果使用 Cloudflare 等 DNS 代理服务器, 请切换到 **仅限 DNS** 设置时。 根主机名称 `apps.example.com` 只有在您计划直接使用时需要单独的记录。

## 配置 CapRover

打开 `http://YOUR_SERVER_IP:3000`. **初始密码 :** `captain42`.

- 更改密码并将根域设置为 `apps.example.com` (无) `*.` 或 `captain.`).
- 挂载板主机名 : `captain.apps.example.com`启用 HTTPS 和 强制 HTTPS 一旦 DNS 和 证书 签发工作。
- 限制公众接触 `3000/tcp` 在仪表板HTTPS工作之后

对证书失败,请检查DNS和入境的TCP 80/443。 见 [域和 HTTPS](domains/index.md).

**CLI 选项 :** 用 CLI 安装 CLI `npm install -g caprover` 运行 `caprover serversetup` 从你的电脑。 见 [CLI 命令](reference/cli.md).

## 部署第一个应用程序

1. 打开 **应用程序** 创建 `my-first-app` 作为网络应用程序。
2. 下级 **部署**并部署:

   ```json
   {
     "schemaVersion": 2,
     "imageName": "nginx:stable-alpine"
   }
   ```

3. 设定 **集装箱 HTTP 端口** 改为 `80`.
4. 打开 `http://my-first-app.apps.example.com`。请查看NGINX欢迎页。
5. 当DNS和端口80可以到达时,在其HTTP设置中为该应用程序设置HTTPS.

**下一个:** [部署自己的密码](deployments/index.md) · [配置应用程序](applications/index.md) · [持久性数据](data-persistence/index.md)

## 低建模( 可选)

如果建筑物内存耗尽, 请检查 `free -h` 和 `swapon --show`如果您有空闲的磁盘空间和 `/swapfile` 不存在 :

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

要在重启后保持互换, 请添加 `/swapfile none swap sw 0 0` **一次** 改为 `/etc/fstab`。对于频繁的建筑,使用更多的记录和档案管理或CI。

<span id="source-index"></span>

## 开始

找到你需要的东西:

- **新安装 :** [开始](get-started.md)
- **应用程序和设置 :** [应用程序](applications/index.md)
- **部署情况:** [部署](deployments/index.md)
- **服务器维护:** [服务器管理](server/index.md)
- **问题:** [解决问题](troubleshooting/index.md)
