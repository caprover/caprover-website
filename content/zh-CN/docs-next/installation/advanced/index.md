---
id: index
title: 高级安装
slug: /installation/advanced
---

<span id="source-installation-local-private-network"></span>

## 当地/私人网络

- 在一台带有私人IP的机器上运行CapRover,用于本地测试或家用服务器.
- 首先决定是只能从你的局域网上还是从公共互联网上取得。
- 仅限私人主机名无法通过通常的HTTP挑战获得公用Let's加密证书.

### 准备机器

- 按照描述安装嵌入引擎 [手动设置](../manual.md),并用 `sudo docker version`.
- 给机器一个稳定的局域网地址.
- 这个例子就是 `192.168.1.12`.
- 安装前, 创建 `/captain/data/config-override.json` 以跳过不适合私有域的公开 DNS 校验 :

```bash
sudo mkdir -p /captain/data
echo '{"skipVerifyingDomains":true}' | sudo tee /captain/data/config-override.json
sudo docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=192.168.1.12 \
  -p 80:80 -p 443:443 -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  caprover/caprover
```

使用机器的实际局域网IP `MAIN_NODE_IP_ADDRESS`从另一个局域网设备打开 `http://192.168.1.12:3000` 并更改初始密码。 允许这些端口通过机器的防火墙为您的预定客户端服务.

### 本地开发主机名

- 关于解决的系统 `*.localhost` 改为本地机器,使用 `captain.localhost` 作为根域和 `http://captain.captain.localhost` 为仪表板。
- 如果通配符 `.localhost` 解析不可用, 请为您选择的开发域使用本地 DNS 服务器; plain `/etc/hosts` 条目无法提供通配符 DNS 。
- 对于 Docker 桌面, 确保 `/captain` 在安装前正确共享/挂载。
- 使用 `MAIN_NODE_IP_ADDRESS=127.0.0.1` 单机本地主机测试 避免公开 让我们加密本地主机域的验证 。

### 仅限私有域

- 配置本地 DNS 服务器以指向 `*.apps.home.example` 改为 `192.168.1.12`,并设置 CapRover 根域为 `apps.home.example` 在仪表板。
- 如果您的 DNS 服务器无法创建通配符记录, 请添加 `captain.apps.home.example` 以及每个应用程序的子域。
- 一台计算机上的主机文件不向其他设备提供通配符DNS.
- 在创建应用程序前从客户端检查名称分辨率 。

在此仅私有名称上使用 HTTP 。 不要让 CapRover 的公众使用, 让我们加密一个无法从公共互联网中解析和到达的域。

### 通过路由器公开访问

- 对于公有领域和HTTPS,将通配符公有DNS A记录指向您的路由器的公有IPv4地址.
- 前进路由器端口 `80/tcp` 改为 `192.168.1.12:80` 和 `443/tcp` 改为 `192.168.1.12:443`.
- 服务器必须保持稳定的LAN IP,进站连接必须到达路由器;载体级NAT可以防止这种设置.

- 在 CapRover 中设置公用根域, 校验 `captain.<root-domain>` 通过 HTTP 解析并到达服务器,然后按 [开始](../../get-started.md).
- 保留管理员端口 `3000` 仅限于您的局域网或其他可信任的访问路径,而不是公开转发。

<span id="source-installation-advanced-custom-host-ports"></span>

## 自定义主机端口

- CapRover通常在主机端口80上发布HTTP,在443上发布HTTPS,在3000上发布初始管理员界面.
- 在新服务器上,使用这些默认值.
- 当另一个服务已经占用主机端口时, 使用手动拖带并更改 Docker 映射和匹配的主机侧面 `CAPTAIN_HOST_*` 设置 :

```bash
sudo docker run -p 10080:80 -p 10443:443 -p 13000:3000 \
  -e ACCEPTED_TERMS=true \
  -e CAPTAIN_HOST_HTTP_PORT=10080 \
  -e CAPTAIN_HOST_HTTPS_PORT=10443 \
  -e CAPTAIN_HOST_ADMIN_PORT=13000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  caprover/caprover
```

- 集装箱端港口仍为80、443和3 000个。
- 这个例子的初始访问是 `http://SERVER_IP:13000`.
- 只打开您架构所需的主机端口 。
- 普通公共证书流 `https://your-domain` URL仍然需要通过80和443路由到CapRover的外部端口;仅改变其主端口并不能通过这些标准端口.
- 在启用 HTTPS 之前规划您的反向代理或端口转发 。

CapRover在安装时将这些主机端口值传递到它的服务中. 更改已公布的已安装端口需要额外照顾, 并且不在此新安装实例之内 。

<span id="source-installation-advanced-reverse-proxy"></span>

## 反向代理假想

- CapRover已经为其仪表板和网络应用运行了NGINX.
- 最简单的公共安装让CapRover拥有80和443端口.
- 如果另一个反向代理必须先终止流量,则在安装CapRover之前先规划路由.

- 外部代理必须把对仪表板和所有应用程序域的请求传递到 CapRover, 保存原始 `Host` 头,支持WebSocket对需要的应用程序进行升级,并有意处理证书的发放和续签.
- CapRover自己的 Let's加密HTTP挑战需要它的验证请求才能在80号端口到达CapRover.
- 在代理中终止HTTPS不会在代理和CapRover之间自动提供HTTPS.

- 对于拥有标准主机端口的代理机后面的新安装,请参见 [自定义主机端口](index.md) 在不同的主机端口发布 CapRover。
- 在移动现有流量前验证仪表盘的路径,一个样本应用,以及证书行为.
- 见 [云纹和反向近缘](../../domains/cloudflare-reverse-proxies.md) 用于域一级的考虑。

反向代理配置取决于代理和想要的TLS边界. 本页面不规定通用配置;被测试的提供者特定配置被推迟.

<span id="source-installation-advanced-existing-swarm"></span>

## 现存的多克冲浪

- CapRover 通常在安装时初始化 Docker Swarm.
- 这个 `useExistingSwarm` 配置覆盖让安装者加入已有初始化的 Swarm 。
- 这是先进的:首先了解CapRover的经理,NGINX,注册,和持续服务将如何放置在您的节点上.

在预定的经理节点上确认 `sudo docker info` 报告一个活跃的Swarm,并且这个节点可以管理它. 确保Swarm网络端口在信任的节点之间打开 : `2377/tcp`, `7946/tcp`, `7946/udp`,以及 `4789/udp`保持对交通的保密

在首次安装前, 请在 CapRover 的持久目录中写入 :

```bash
sudo mkdir -p /captain/data
echo '{"useExistingSwarm":true}' | sudo tee /captain/data/config-override.json
```

- 运行 Docker 拖曳命令 [手动设置](../manual.md) 在这个管理器节点上。 自动安装器拒绝 。 `/captain` 配置并不适合此覆盖 。
- CapRover 读取 `useExistingSwarm` 并使用现有的Swarm。
- 首先在一次性或精心规划的集群上这样做:CapRover在Swarm创建和管理服务和网络,其持续状态仍然处于 `/captain` 在CapRover节点。

对于超出一个节点的应用调度,在通过CapRover添加节点之前,需要默认的按压注册. 读取 [设置多节点集群](../../scaling/multi-node.md) 在将应用程序部署到整个节点之前。

<span id="source-guides-home-server"></span>

## 主机/ 本地服务器设置

本地测试,使用 [本地/私人网络安装](index.md)公共住宅的部署还需要一个稳定的交通途径,才能到达东道方。

1. 给主机一个稳定的局域网地址. 用于手动嵌入器安装, 使用 [手动设置](../manual.md).
2. 标准 [安装器](../../get-started.md),将您的路由器中的TCP 80, 443和3000转发到主机. 安装者在设置后报告外部可达性检查;NAT和提供者防火墙仍然需要人工关注.
3. 安装 CapRover,然后将通配符DNS和仪表盘主机名指向路由器的公共地址. 如果您的ISP更改了地址, 请使用可靠的 DNS 更新进程 。
4. 完成 root- domain 和 HTTPS 步骤 [开始](../../get-started.md),并从设备中验证仪表板和测试应用程序 **外部** 局域网.
5. 在仪表板从局域网外通过HTTPS工作后,移除公埠3000转发规则,并通过仪表板主机名保持管理员访问. 备份 CapRover 状态和应用数据离站.

- 载体级NAT,阻塞的进港端口,或只连接IPv6,可以阻止正常的公众访问和证书的签发.
- 在这些情况下,使用公共的VPS、适当的带有自身安全模型的反向代理/隧道,或保持安装的私人性。
- 检查您的路由器和ISP 在清除 CapRover 的故障前。
