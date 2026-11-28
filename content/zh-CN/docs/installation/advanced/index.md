---
id: index
title: 高级安装
slug: /installation/advanced
---

<span id="source-installation-local-private-network"></span>

## 局域网与私有网络

- CapRover 可以运行在使用私有 IP 的机器上，适用于本地测试或家庭服务器。
- 先确定该服务器仅在 LAN 内可访问，还是也需要从公网访问。
- 仅在私有网络中可访问的 hostname 通常无法通过公开的 HTTP challenge 获取 Let's Encrypt 证书。

### 准备服务器

- 按照[手动安装](../manual.md)指南安装 Docker Engine，并运行 `sudo docker version` 验证。
- 为服务器分配固定的 LAN IP。
- 下文示例使用 `192.168.1.12`。
- 安装前创建 `/captain/data/config-override.json`，跳过不适用于私有域名的公网 DNS 验证：

```bash
sudo mkdir -p /captain/data
echo '{"skipVerifyingDomains":true}' | sudo tee /captain/data/config-override.json
sudo docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=192.168.1.12 \
  -p 80:80 -p 443:443 -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  caprover/caprover
```

将 `MAIN_NODE_IP_ADDRESS` 设置为实际 LAN IP。从其他局域网设备打开 `http://192.168.1.12:3000`，并修改初始密码。服务器防火墙只应对需要访问的客户端开放相关端口。

### 本地开发域名

- 如果系统把 `*.localhost` 解析到本机，可以使用 `captain.localhost` 作为根域名，通过 `http://captain.captain.localhost` 打开 dashboard。
- 如果系统不支持 `.localhost` 的通配符解析，请使用本地 DNS 服务管理开发域名；普通 `/etc/hosts` 记录不支持通配符 DNS。
- 使用 Docker Desktop 时，安装前确认 `/captain` 已正确挂载并允许共享。
- 只在本机测试时，可以使用 `MAIN_NODE_IP_ADDRESS=127.0.0.1`。不要为 localhost 域名尝试公开的 Let's Encrypt 验证。

### 仅供私有网络使用的域名

- 在本地 DNS 中将 `*.apps.home.example` 指向 `192.168.1.12`，并在 dashboard 中设置根域名为 `apps.home.example`。
- 如果 DNS 服务不支持通配符记录，应分别添加 `captain.apps.home.example` 和每个应用的子域名。
- 一台电脑上的 hosts 文件不会让其他设备自动获得通配符解析。
- 创建应用之前，先从客户端确认 DNS 可以解析。

这些仅供私有网络使用的域名应采用 HTTP。如果域名无法从公网解析和访问，请不要启用 CapRover 的公开 Let's Encrypt 流程。

### 通过路由器提供公网访问

- 如果需要公网域名和 HTTPS，请将公开 DNS 的通配符 A 记录指向路由器公网 IPv4。
- 将路由器的 `80/tcp` 转发到 `192.168.1.12:80`，将 `443/tcp` 转发到 `192.168.1.12:443`。
- 服务器必须使用固定 LAN IP，并确保公网连接能够到达路由器；运营商级 NAT（CGNAT）可能阻止这种配置。

- 在 CapRover 中设置公网根域名，确认 `captain.<root-domain>` 能解析并通过 HTTP 访问，再按照[快速入门](../../get-started.md)启用 dashboard 和应用 HTTPS。
- 管理端口 `3000` 应仅允许 LAN 或其他可信连接访问，不建议将它直接映射到公网。

<span id="source-installation-advanced-custom-host-ports"></span>

## 自定义宿主机端口

- 默认情况下，CapRover 在宿主机端口 80 提供 HTTP、443 提供 HTTPS、3000 提供初始管理界面。
- 全新服务器优先使用默认端口。
- 如果其他服务占用了端口，请手动安装，并同时修改 Docker 映射的宿主机端口与对应的 `CAPTAIN_HOST_*` 参数：

```bash
sudo docker run -p 10080:80 -p 10443:443 -p 13000:3000 \
  -e ACCEPTED_TERMS=true \
  -e CAPTAIN_HOST_HTTP_PORT=10080 \
  -e CAPTAIN_HOST_HTTPS_PORT=10443 \
  -e CAPTAIN_HOST_ADMIN_PORT=13000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  caprover/caprover
```

- 容器内部端口仍然是 80、443 和 3000。
- 此示例的初始访问地址为 `http://SERVER_IP:13000`。
- 只开放部署架构所需的宿主机端口。
- 如果需要通过普通 `https://your-domain` URL 提供服务或申请公开证书，外部端口 80 和 443 仍必须转发至 CapRover。修改宿主机端口本身不会自动配置这种转发。
- 启用 HTTPS 前先配置好反向代理或端口转发。

CapRover 在安装时会使用这些宿主机端口参数创建服务。修改已有安装的端口涉及额外风险，本示例只适用于全新安装。

<span id="source-installation-advanced-reverse-proxy"></span>

## 反向代理部署场景

- CapRover 自带 NGINX，用于为 dashboard 和 Web 应用提供服务。
- 最简单的公网安装方式是让 CapRover 直接使用 80 和 443 端口。
- 如果必须由另一个反向代理先接收流量，请在安装前规划路由。

- 外部代理需要将 dashboard 和全部应用域名转发到 CapRover，保留原始 `Host` header，按需支持 WebSocket upgrade，并妥善处理证书签发和续期。
- CapRover 的 Let's Encrypt HTTP challenge 请求必须能通过 80 端口到达 CapRover。
- 反向代理终止 HTTPS，并不代表代理到 CapRover 之间也使用 HTTPS。

- 如果代理占用了标准宿主机端口，参考[自定义宿主机端口](index.md)，让 CapRover 使用其他端口。
- 切换现有流量前先测试 dashboard 路由、示例应用和证书签发。
- 域名层面的说明请参阅 [Cloudflare 与反向代理](../../domains/cloudflare-reverse-proxies.md)。

反向代理配置取决于具体产品和 TLS 终止位置。本页不提供适用于所有环境的通用配置，部署前必须验证实际代理行为。

<span id="source-installation-advanced-existing-swarm"></span>

## 使用已有 Docker Swarm

- CapRover 通常会在安装过程中初始化 Docker Swarm。
- 通过 `useExistingSwarm` override，可以在已经初始化的 Swarm 中部署 CapRover。
- 这是高级配置。使用前应规划 CapRover manager、NGINX、registry 和持久化服务的节点位置。

在目标 manager 上运行 `sudo docker info`，确认 Swarm 已启用且当前节点具备管理权限。可信节点之间需要开放 `2377/tcp`、`7946/tcp`、`7946/udp` 和 `4789/udp`。Overlay 网络流量应保持私有。

首次安装前，在 CapRover 持久化目录中写入 override：

```bash
sudo mkdir -p /captain/data
echo '{"useExistingSwarm":true}' | sudo tee /captain/data/config-override.json
```

- 在该 manager 节点执行[手动安装](../manual.md)中的 Docker 命令。自动安装脚本会拒绝已存在的 `/captain` 配置，因此不适用于此场景。
- CapRover 读取 `useExistingSwarm` 后将使用当前 Swarm。
- 建议先在测试集群中验证，或提前做好规划：CapRover 会在现有 Swarm 内创建并管理服务和网络，持久化状态保存在 CapRover 节点的 `/captain` 目录中。

如果需要跨节点调度应用，必须在 CapRover 添加节点前配置 default push registry。跨节点部署之前请阅读[多节点集群配置](../../scaling/multi-node.md)。

<span id="source-guides-home-server"></span>

## 家庭或本地服务器

仅用于本地测试时，参考[局域网与私有网络安装](index.md)。要从公网访问家庭服务器，还需要稳定的入站网络连接。

1. 为宿主机分配固定 LAN IP。如需手动安装 Docker，参阅[手动安装](../manual.md)。
2. 如果使用标准[安装脚本](../../get-started.md)，将路由器的 TCP 80、443 和 3000 端口转发到服务器。安装脚本会检查外部可达性，但 NAT 和云/运营商防火墙仍需自行配置。
3. 安装 CapRover，并将通配符 DNS 与 dashboard 域名指向路由器公网 IP。如果 ISP 会变更公网 IP，配置可靠的动态 DNS 更新流程。
4. 按照[快速入门](../../get-started.md)完成根域名和 HTTPS 配置，并从 **LAN 以外**的设备测试 dashboard 和示例应用。
5. 确认可以从公网通过 HTTPS 访问 dashboard 后，删除路由器上公网 3000 端口转发规则。管理操作通过 dashboard 域名完成，并将 CapRover 配置和应用数据备份到异地。

- CGNAT、运营商屏蔽入站端口或仅支持 IPv6 的网络，可能阻止常规公网访问和证书签发。
- 此时可以使用公网 VPS、具有独立安全机制的反向代理或隧道，或者保持为私有部署。
- 排查 CapRover 前，请先确认路由器和 ISP 的网络限制。
