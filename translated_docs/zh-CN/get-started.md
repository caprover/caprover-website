---
id: get-started
title: 开始使用
sidebar_label: 开始使用
---

## 简单安装

推荐通过 DigitalOcean 一键应用安装 CapRover。CapRover 已在 DigitalOcean marketplace 中作为 One-Click 应用提供。

如果你是 DigitalOcean 新用户，注册后前两个月可获得 **\$100 免费额度**。这足够运行多台服务器两个月。

如果使用这种方法，可以跳过下面的 **前置条件** 部分，以及 **CapRover 安装** 的第 1 步。

<br/>

<a href="https://marketplace.digitalocean.com/apps/caprover?action=deploy&refcode=6410aa23d3f3" target="_blank" rel="noreferrer noopener">
<img src="/img/do-btn-blue.svg" alt="CreateDroplet" style="width:300px;"/>
</a>

<br/>

## 前置条件

### A) 域名

安装过程中，系统会要求你把一条通配符 DNS 记录指向 CapRover 的 IP 地址。这项费用最低大约每年 \$2（或[更低](https://www.reddit.com/r/selfhosted/comments/sp8etq/comment/hwdgztx/?utm_source=reddit&utm_medium=web2x&context=3)！）

你也可以在没有域名的情况下使用 CapRover。但这样无法配置 HTTPS。

### B) 服务器

#### B1) 公网 IP

_补充：你可以在位于 NAT（路由器）后面的私有网络中，在笔记本上[本地安装 CapRover](run-locally.md)。但如果你想启用 HTTPS，和/或从私有网络外部访问应用，就需要一些特殊设置，例如端口转发。_

标准安装中，CapRover 必须安装在具有公网 IP 的机器上。如果你需要了解公网 IP，见 [服务器与公网 IP 地址](server-purchase/digitalocean.md)。费用最低大约每月 $5。如果使用 DigitalOcean 推荐码，你会获得 $100 额度，相当于两个月的免费服务器：https://m.do.co/c/6410aa23d3f3

#### B2) 服务器规格

_**CPU 架构**：_ CapRover 源码兼容任意 CPU 架构。Docker Hub 上的构建支持 AMD64 (X86)、ARM64 和 ARMV7。

_**推荐环境**：_ CapRover 在 Ubuntu 24.04 和 Docker 25+ 上经过测试。如果你在其他操作系统上使用 CapRover，可以参考 [Docker 文档](https://docs.docker.com/engine/userguide/storagedriver/selectadriver/#supported-storage-drivers-per-linux-distribution)。

_**最低 RAM**：_ 构建过程有时会消耗大量 RAM，512MB RAM 可能不够（见[这个问题](https://github.com/caprover/caprover/issues/28)）。大多数服务商的 \$5 实例至少提供 1GB RAM，包括 DigitalOcean、Vultr、Scaleway、Linode、SSD Nodes 等。

#### B3) Docker

服务器必须已安装 Docker。如果你从 DigitalOcean 获取服务器，可以选择带 CapRover 一键应用的服务器，系统会自动完成安装。否则，请按照[这份说明](https://docs.docker.com/engine/installation)安装 Docker CE。注意 Docker 版本至少需要 25.x+。

**不要使用 snap 安装** [用 snap 安装 Docker 有问题](https://github.com/caprover/caprover/issues/501#issuecomment-554764942)。请使用 Docker 官方安装说明。

#### B4) 配置防火墙

一些服务商的防火墙设置比较严格。在 Ubuntu 上放行防火墙：

```bash
ufw allow 80,443,3000,996,7946,4789,2377/tcp; ufw allow 7946,4789,2377/udp;
```

需要更多细节时，见[防火墙设置](firewall.md)。

<br/>
<br/>

# CapRover 安装

## 第 1 步：安装 CapRover

运行下面这一行，然后等待即可。

```bash
docker run -p 80:80 -p 443:443 -p 3000:3000 -e ACCEPTED_TERMS=true -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

注意：不要修改端口映射。CapRover 只在指定端口上工作。

屏幕上会输出大量信息。CapRover 初始化完成后，在浏览器中访问 `http://[IP_OF_YOUR_SERVER]:3000`，使用默认密码 `captain42` 登录。之后可以修改密码。**但先不要在控制台里做任何更改**。我们会使用命令行工具来配置服务器（推荐）。

## 第 2 步：连接根域名

假设你拥有 `mydomain.com`。你可以在 DNS 设置中把 `*.something.mydomain.com` 设为 `A-record`，指向安装了 CapRover 的服务器 IP。注意，这个更改可能需要几个小时才生效。DNS 配置看起来会像这样：

- **TYPE**：A record
- **HOST**：`*.something`
- **POINTS TO**：（你的服务器 IP 地址）
- **TTL**：（影响不大）

要确认结果，打开 https://mxtoolbox.com/DNSLookup.aspx，输入 `randomthing123.something.mydomain.com`，检查 IP 是否解析到你在 DNS 中设置的地址。需要 `randomthing123`，是因为你设置的是通配符记录 `*.something`，而不是 `something`。

> **注意**：CapRover 要求 A Record 指向 CapRover 的 IP 地址。如果你使用 Cloudflare 这类代理服务，可能会遇到困难。CapRover 官方不支持这类用法。

## 第 3 步：配置并初始化 CapRover

### 使用 CLI（推荐）

假设你的本地机器（例如笔记本）已安装 npm，运行下面的命令（如有需要加上 `sudo`）：

```bash
 npm install -g caprover
```

然后运行

```bash
 caprover serversetup
```

按步骤登录你的 CapRover 实例。当系统提示输入根域名时，输入 `something.mydomain.com`，前提是你已在第 2 步把 `*.something.mydomain.com` 指向你的 IP。之后就可以通过 `captain.something.mydomain.com` 访问 CapRover。关于隐藏根域名，见[这里](./best-practices.md#hidden-root-domain)。

> **注意**：**如果你已经在 CapRover 实例上强制启用了 HTTPS，就无法继续完成 `caprover serversetup`。**
> 这种情况下，直接使用 `caprover login` 登录。要修改密码，请到应用的设置菜单。

### 使用 Web 界面（不需要 npm）

1. 登录 `http://[IP_OF_YOUR_SERVER]:3000`
2. 配置根域名
3. 启用 HTTPS，然后强制使用 HTTPS
4. 通过 HTTPS 连接后，修改默认密码（`captain42`）

## 第 4 步：（可选）设置 Swap 文件

在某些情况下，物理 RAM 不足会导致问题。
例如，构建 Docker 镜像时如果占用过多内存，构建会失败。
要绕过这些问题（而不购买更多 RAM），可以设置 Swap 文件（用作虚拟 RAM），
按照 [How To Create A Linux Swap File](https://linuxize.com/post/create-a-linux-swap-file/) 操作。

## 第 5 步：部署测试应用

在浏览器中打开 CapRover，从左侧菜单选择 Apps，创建一个新应用。把它命名为 `my-first-app`。然后从<a href="https://github.com/caprover/caprover/tree/master/captain-sample-apps">这里</a>下载任意测试应用，解压内容。进入测试应用目录后，运行：

```bash
/home/Desktop/captain-examples/captain-node$  caprover deploy
```

按提示操作，当询问应用名称时输入 `my-first-app`。第一次构建大约需要两分钟。构建完成后，访问 `my-first-app.something.mydomain.com`，其中 `something.mydomain.com` 是你的根域名。
恭喜！你的应用已经上线。

你可以把多个自定义域名（例如 `www.my-app.com`）连接到同一个应用，启用 HTTPS，并在应用设置页完成更多操作。

注意，运行 `caprover deploy` 时，当前 git commit 会被发送到服务器。

> **重要**：未提交的文件和 `gitignore` 中的文件**不会**发送到服务器。

你可以在浏览器中打开 CapRover，为应用设置自定义参数，例如环境变量，并完成更多操作。关于部署的更多细节，见 [CLI 文档](cli-commands.md)。关于 `captain-definition` 文件，见 [Captain Definition 文件](captain-definition-file.md)。
