---
id: multi-node
title: 设置多节点集群
slug: /scaling/multi-node
---

CapRover使用Docker Swarm. 经理管理CapRover的控制服务;worker管理应用任务.

**添加节点前 :** 准备Docker,私人网络,SSH,和一个共享的注册.

## 1. 准备服务器

在新的 Ubuntu 服务器上安装 Docker 引擎 :

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

- 使用管理器中可到达的稳定IP.
- Docker的Swarm状态应该是 `inactive`.
- 选择 **worker 节点** 对于普通的应用程序主机。 manager 节点的作用需要法定人数规划。

## 2. 网络和SSH

**仅在信任的节点之间 :**

- `2377/tcp`: Swarm管理
- `7946/tcp` 和 `7946/udp`: 节点通信
- `4789/udp`: 重叠网络

**嘘:**

1. 使用专用的私人密钥和有Docker访问权限的用户(通常是root).
2. 将公钥添加到新服务器 `authorized_keys`.
3. 测试 SSH **从经理的网络** 到新服务器。
4. 在节点设置时给 CapRover 私人密钥 。

Docker组成员给予root等同的访问权限. 将SSH和Swarm两个端口都限制在信任的主机内. 审查UFW规则 CapRover 在加入时添加.

## 3. 镜像仓库

1. 配置 a [默认 push registry](../deployments/registries/index.md) 可达者 **每个节点**。CapRover在添加节点前需要它。
2. 重新部署在registry启用之前建造的应用程序,以推进其镜像。
3. 校验新节点可以拉出新建的镜像 。 预建的私人镜像也需要牵引访问.

## 4. 添加和核实节点

1. 内 **集群 + 节点**,输入管理器和workerIP,SSH主机/端口/用户,私钥,以及节点角色.
2. 加入节点. 检查它看起来健康,检查 `docker node ls` 在经理。
3. 规模a **无国籍人** 测试应用并检查位置 `docker service ps SERVICE_NAME`.
4. 测试应用域. 如果放置失败,则检查注册拉动、节点健康和任务错误。

## 5. 持久化应用程序

- 本地卷和绑定在节点上。
- CapRover pins 持久应用程序; 加入一个节点不会复制数据 。
- 在改变位置前备份并迁移数据.
- 见 [集群中的持续应用](multi-node.md).

<span id="source-scaling-manage-nodes"></span>

## 管理节点

使用 **集群 + 节点** 视图和 `docker node ls` 以检查节点的可用性和作用。 `docker service ps SERVICE_NAME` 显示应用程序的任务运行地点和任务为何启动。

- 在移除或排出节点之前,请识别其运行的应用程序和任何本地卷或绑定的挂载.
- 如果可从registry获取镜像,通常可以重新安排无国籍任务;持久化数据不会自动跟踪这些任务。
- 在更改位置之前, 备份并刻意移动数据 。

- 保持 Swarm 管理和覆盖端口仅限于信任的节点地址.
- 如果一个节点不能加入,则验证Docker被安装,其Swarm不活动,SSH证书从管理器工作,注册和节点间路由可以到达.

<span id="source-scaling-persistent-apps"></span>

## 集群中的持续应用

- CapRover 通常将持续应用限制在一个选定的节点上的一个实例.
- 使用默认本地驱动程序命名的 Docker 音量, 并绑定在节点上同时存储数据; 第二个节点不会自动看到这些文件 。

- 要移动一个持久化的应用程序,备份和 tiesce 写入,恢复目的地的数据,检查权限,更新放置,然后用一个实例验证该应用程序.
- 保留旧副本直到新实例得到证实为止.
- 一个节点失败会使一个被绑定的app无法使用,直到它的数据在其他地方恢复为止.

- 共享或外部存储是一种高级设计,必须支持应用程序的一致性和同时写入的要求.
- 单靠越来越多的实例数并不能提供这种存储。
- 见 [共享/ 外部存储](../data-persistence/shared-storage.md).

<span id="source-scaling-networking"></span>

## 多节点网络配置

- Docker Swarm的覆盖网络允许服务在节点之间进行通信.
- 在信任的节点之间, 允许 `2377/tcp` 管理层 `7946/tcp` 和 `7946/udp` 用于节点通信,以及 `4789/udp` 堵车
- 将这些端口限制在节点地址;公共网络流量仍然到达CapRover的HTTP/HTTPS入口点.

- 公共应用程序端口在 `ingress` 模式可以使用 Swarm 路由网。
- 内 `host` 模式它发布在任务运行的地方,所以放置会影响哪个节点的地址答案。
- 对于内部数据库流量,使用目的地app的服务名称和容器端口而不使用公共映射.

如果新节点加入但任务无法沟通,则在更改应用设置前检查节点间防火墙,Docker服务状态,以及网络成员. 见全 [端口参考](../reference/ports.md).
