---
id: run-locally
title: 在本地运行
sidebar_label: 在本地运行
---

<br/>
注意，这是一个**高级过程**。这一节使用的一些概念对初学者来说并不容易。要在本机运行 CapRover（仅用于测试和开发），你需要在机器上安装 Docker。

<br/>

> 注意：如果你更喜欢可视化教程，请参考这个由社区创建的 YouTube 教程：https://www.youtube.com/watch?v=J_6H11DrzXY

关于根域名，CapRover 默认使用 `http://captain.captain.localhost`。在大多数系统上，`captain.captain.localhost` 会自动解析到机器的本地 IP 地址，也就是 127.0.0.1，因此不需要额外工作。

> 不过，如果它没有自动这样做，你需要手动把 `*.captain.localhost` 指向 `127.0.0.1` 或 `192.168.1.2`（你的本地 IP）。**注意** 只改 `etc/hosts` 不够，因为 Captain 需要通配符条目，而 `etc/hosts` 不允许通配符，也就是 `*.something`。在 ubuntu 16 上，内置了 `dnsmasq`（本地 DNS 服务器）。因此，只需编辑这个文件：`/etc/NetworkManager/dnsmasq.d/dnsmasq-localhost.conf`（如果不存在就创建它），并加入这一行：`address=/captain.localhost/192.168.1.2`，其中 `192.168.1.2` 是你的本地 IP 地址。要确认你有 `dnsmasq`，可以在终端运行 `which dnsmasq`。如果可用，终端会打印它的路径；否则不会打印任何内容。
> 注意：对于 Ubuntu 18，阅读 https://askubuntu.com/questions/1029882/how-can-i-set-up-local-wildcard-127-0-0-1-domain-resolution-on-18-04

要验证上面提到的两个前置条件：

- 运行 `docker version`，确保版本至少是[文档](get-started.md#c-install-docker-on-server-at-least-version-1706x)中提到的版本
- 运行 `nslookup randomstring123.captain.localhost`，确保它解析到 `127.0.0.1` 或你的本地 IP（类似 `192.168.1.2`）：

```
Server:		127.0.1.1
Address:	127.0.1.1#53

Name:	randomstring123.captain.localhost
Address: 192.168.1.2
```

## 安装

确认前置条件准备好后，你可以像在服务器上一样，在本机安装 Captain。确保以具有足够权限的用户运行，也就是在 linux 系统上使用 `sudo`。只需按照这里的步骤操作：[Captain Installation](get-started#step-1-captain-installation)，但下面提到的几点除外。

### 差异：

#### 主 IP

首先，本地安装命令需要一个额外参数（`MAIN_NODE_IP_ADDRESS`）

```bash
echo  "{\"skipVerifyingDomains\":\"true\"}" >  /captain/data/config-override.json
docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=127.0.0.1 -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```
**注意：** 如果端口 80 和 443 当前已被占用，并且你想在反向代理后面运行 CapRover，[见这里](https://github.com/caprover/caprover/issues/1166#issuecomment-2430704491)。

#### 设置

不要运行 `caprover serversetup`。改为打开 http://captain.captain.localhost:3000，并手动把根域名设为 `captain.localhost`。不要启用/强制 HTTPS。显然，你不能在本地域名（captain.localhost）上启用 HTTPS。

把根域名设为 `captain.localhost` 后，使用 `caprover login`，把 `http://captain.captain.localhost` 作为 captain URL，把 `captain42` 作为默认密码。

> 不过，如果你想从局域网中的另一台设备访问 CapRover 实例，可以把根域名设为 `captain.LOCAL_IP.sslip.io`（例如 `captain.192.168.1.2.sslip.io`）。

**非 LINUX 用户**
你需要把 `/captain` 加入共享路径。
操作方法：点击 Docker 图标 -> Setting -> File Sharing，然后添加 `/captain`

这样就完成了。

## 在私有 [本地] 网络上安装 CapRover

当你想在家庭网络上安装 CapRover 时，这会很有用，例如在 Raspberry pi 上。

假设你有这个网络：

```
┌───────────────────────┐
│    Your Router        │
│                       │
│     public IP         │
│    11.22.33.44        │           your private network
├───────────────────────┴─────────────────────────────────────────────────────────────────────┐
│                                                                                             │
│ ┌────────────────┐      ┌──────────────────┐        ┌──────────────────┐                    │
│ │                │      │                  │        │                  │                    │
│ │    PC1         │      │     PC2          │        │       PC3        │                    │
│ │                │      │                  │        │                  │                    │
│ │  192.168.1.10  │      │    192.168.1.11  │        │    192.168.1.12  │                    │
│ │                │      │                  │        │                  │                    │
│ └────────────────┘      └──────────────────┘        └──────────────────┘                    │
│                                                                                             │
│                                                                                             │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

你可以通过运行这条命令，在 PC3 上安装 CapRover：

```bash
echo  "{\"skipVerifyingDomains\":\"true\"}" >  /captain/data/config-override.json
docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=192.168.1.12 -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

唯一额外的部分是：` -e MAIN_NODE_IP_ADDRESS=192.168.1.12`，以及在 CapRover 上禁用域名验证。

此时，你应能从 PC1 和 PC2 通过浏览器访问 `http://192.168.1.12:3000`，打开 CapRover 控制台。

你仍然无法部署应用，但控制台应可访问。
如果控制台无法访问，说明存在内部防火墙，阻止 PC1 访问 PC3。

如果控制台可以访问，继续下一阶段。

### 选项 1 - 仅内部使用：

你可以在内部网络上安装 CapRover，使它只能从私有网络访问。如果要这样做，必须在本地 DNS 服务器中把 `*.caproverinstance.local` 或类似名称指向 `192.168.1.12`。如果你没有本地 DNS 服务器，就不能这样做。

一些本地 DNS 服务器（例如 PiHole）不允许本地 DNS 条目使用通配符，这时你必须把 `captain.caproverinstance.local` 指向该 IP。以后再逐个添加应用名称。虽然繁琐，但可以做到。

现在，通过 `http://192.168.1.12:3000` 打开控制台，并把根域名更新为 `caproverinstance.local`。

此时，你应能在浏览器中通过 `http://captain.caproverinstance.local` 访问控制台。
如果这里有问题，说明本地 DNS 服务器没有按预期工作。你必须先修复它。

注意，你不应（也无法）为内部域名启用 HTTPS。

### 选项 2 - 让实例可以从外部访问。

要求：你的公网 IP 必须是静态 IP 地址。

这和你在可公开访问的 VPS 上安装 CapRover 非常相似。你只需要在路由器上启用端口转发：

```
port 80 of router => port 80 of 192.168.1.12
port 443 of router => port 80 of 192.168.1.12
```

现在使用常规 DNS 提供商，把 `*.domain.com` 映射到网络的公网 IP 地址。

然后，像正常安装一样，登录 `http://192.168.1.12:3000`，并把根域名更新为 `domain.com`

此时，你的实例应可通过 `http://captain.domain.com` 访问。你可以启用 HTTPS 并部署应用。

## 排查问题：

如上所述，在本机运行是一项高级任务，可能因不同原因失败。取决于错误，解决方案可能不同。例如，如果你遇到下面的错误：

```
Captain Starting ...
Installing Captain Service ...
December 18th 2017, 11:51:11.295 pm    Starting swarm at 34.232.18.13:2377
Installation failed.
{ Error: (HTTP code 400) bad parameter - must specify a listening address because the address to advertise is not recognized as a system address, and a system's IP address to use could not be uniquely identified
    at /usr/src/app/node_modules/docker-modem/lib/modem.js:254:17
    at process._tickCallback (internal/process/next_tick.js:180:9)
  reason: 'bad parameter',
  statusCode: 400,
  json:
   { message: 'must specify a listening address because the address to advertise is not recognized as a system address, and a system\'s IP address to use could not be uniquely identified' } }
```

你可以尝试这个：

```bash
docker run -e ACCEPTED_TERMS=true -e "MAIN_NODE_IP_ADDRESS=192.168.1.2" -v /var/run/docker.sock:/var/run/docker.sock caprover/caprover
```

并把 `192.168.1.2` 替换成你自己的本地 IP。
