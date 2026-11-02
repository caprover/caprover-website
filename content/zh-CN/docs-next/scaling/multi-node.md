---
id: multi-node
title: 配置多节点集群
slug: /scaling/multi-node
---

CapRover 基于 Docker Swarm。Manager 节点运行 CapRover 控制服务，worker 节点负责执行应用任务。

**添加节点前：**准备 Docker、节点间私有网络、SSH 访问和共享镜像仓库。

## 1. 准备服务器

在新 Ubuntu 服务器上安装 Docker Engine：

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
sudo docker info --format '{{.Swarm.LocalNodeState}}'
```

- 使用 manager 节点能够访问的固定 IP。
- 新节点的 Docker Swarm 状态应为 `inactive`。
- 普通应用服务器选择 **worker** 角色。添加 manager 节点需要考虑 Swarm quorum（仲裁）。

## 2. 节点间网络和 SSH

**以下端口仅对可信节点开放：**

- `2377/tcp`：Swarm 管理通信
- `7946/tcp` 和 `7946/udp`：节点间通信
- `4789/udp`：overlay 网络

**SSH：**

1. 使用专用 SSH 私钥，并选择具有 Docker 操作权限的用户（通常是 root）。
2. 将公钥加入新服务器的 `authorized_keys`。
3. 从 **manager 节点所在网络**测试 SSH 连接到新服务器。
4. 在 CapRover 中添加节点时提供私钥。

Docker 用户组成员通常具有与 root 等效的权限。将 SSH 和 Swarm 端口限制在可信主机之间，并检查 CapRover 在节点加入时配置的 UFW 规则。

## 3. 配置镜像仓库

1. 配置所有节点都能访问的[默认 push registry](../deployments/registries/index.md)。这是通过 CapRover 添加多节点的前提。
2. 如果某些应用在启用 registry 前已经构建，重新部署它们，让镜像被 push 到 registry。
3. 检查新节点能否 pull 新构建的镜像。对于私有预构建镜像，也需要配置拉取权限。

## 4. 添加并验证节点

1. 在 **Cluster → Nodes** 中填写 manager/worker IP、SSH 主机名、端口、用户、私钥及节点角色。
2. 加入节点后，确认 CapRover 显示节点健康，并在 manager 节点运行 `docker node ls`。
3. 将一个**无状态（stateless）**测试应用扩容，使用 `docker service ps SERVICE_NAME` 检查任务所在节点。
4. 访问应用域名。如果调度失败，检查 registry pull、节点状态和任务错误。

## 5. 持久化应用

- 本地 Docker 数据卷和 bind mount 中的数据保留在原节点。
- CapRover 会将有持久化数据的应用固定到指定节点；添加节点不会复制数据。
- 修改节点调度前先备份并迁移数据。
- 参阅[集群中的持久化应用](multi-node.md)。

<span id="source-scaling-manage-nodes"></span>

## 管理节点

通过 CapRover 的 **Cluster → Nodes** 页面以及 manager 上的 `docker node ls` 检查节点状态和角色。`docker service ps SERVICE_NAME` 可以查看任务运行的位置及启动失败原因。

- 移除或 drain 节点前，先确认该节点运行的应用及其本地数据卷和 bind mount。
- 如果镜像可从 registry 获取，无状态任务通常可以重新调度；持久化数据不会随任务自动迁移。
- 更改调度位置前，有计划地备份并迁移数据。
- Swarm 管理端口和 overlay 网络端口仅应对可信节点开放。
- 节点无法加入时，检查 Docker 安装、Swarm 是否为 `inactive`、从 manager 发起的 SSH 连接，以及 registry 和节点间网络连通性。

<span id="source-scaling-persistent-apps"></span>

## 集群中的持久化应用

- CapRover 通常将有持久化数据的应用限制为指定节点上的一个实例。
- 默认 local driver 的 Docker named volume 和 bind mount 都使用该节点的本地存储。其他节点无法自动访问这些文件。
- 迁移持久化应用前，先备份并暂停写入，将数据恢复到目标节点，核实权限，再更新节点调度，最后用单实例验证应用。
- 新实例验证完成前，保留旧数据副本。
- 固定到某个节点的应用在该节点故障后，可能需要先将数据恢复到其他节点才能重新运行。
- 共享或外部存储需要正确处理应用的一致性和并发写入需求，属于高级部署方案。
- 单纯增加实例数并不能提供共享存储。参阅[共享／外部存储](../data-persistence/shared-storage.md)。

<span id="source-scaling-networking"></span>

## 多节点网络

- Docker Swarm overlay 网络允许跨节点服务通信。
- 在可信节点间开放 `2377/tcp`（管理）、`7946/tcp` 和 `7946/udp`（节点通信）、`4789/udp`（overlay 流量）。
- 这些端口应限制为节点地址；公网 Web 请求仍通过 CapRover 的 HTTP/HTTPS 入口。
- 使用 `ingress` 模式发布的端口可以通过 Swarm routing mesh 转发。
- 使用 `host` 模式时，端口只发布在运行任务的节点上，因此任务调度会影响哪个节点能接收请求。
- 数据库等内部通信使用目标应用的服务名和容器端口，无需发布公网端口。

如果新节点已经加入，但任务间无法通信，先检查节点间防火墙、Docker 服务状态和网络成员关系。参阅完整的[端口参考](../reference/ports.md)。
