---
id: app-scaling-and-cluster
title: 应用扩展与集群
sidebar_label: 应用扩展与集群
---

<br/>

CapRover 提供多种方式扩展应用，让它在多个进程中运行，以利用服务器上的全部资源。

## 运行应用的多个实例：

你的 Pizza 应用表现很好，网站获得了数千次访问。只运行一个应用实例已经不够。延迟上升了。接下来你应考虑在 Captain 上运行应用的多个实例。你可以在 Captain Web 的 Apps 部分完成这件事。假设你把实例数改成 3。Captain 会同时创建 3 个应用实例。如果其中任何一个死亡（崩溃），它会自动再启动一个。你始终会有 3 个 Pizza 应用实例在运行。最好的部分是：Captain 会自动在不同实例之间分配请求。

## 运行多台服务器：

哇，你的 Pizza 应用真的很受欢迎。你在同一台服务器上运行了 3 个应用实例，RAM 和 CPU 几乎用满了。你需要第二台服务器。如何连接这些服务器？Captain 会帮你完成。你只需准备一台已安装 Docker 的服务器，和最初的 Captain 服务器一样。确保你的新服务器可以通过 SSH 从原始 Captain 服务器访问（例如，把 Captain 的 ssh 公钥复制到第二台服务器）。

CapRover 底层使用 [Docker Swarm](https://docs.docker.com/engine/swarm/)。它提供一个选项，让你用 CapRover UI 设置节点集群。或者，你也可以使用普通的 Docker Swarm 命令 `docker swarm join...` 来设置集群。这两种方法没有任何区别。第一种使用 UI，第二种使用命令行。

此时，你需要输入以下信息：

- CapRover IP Address (as seen by remote)：这是原始服务器的 IP 地址
- New node IP Address (as seen by Captain)：这是第二台服务器的 IP 地址
- Private SSH key for `root` user：这是 CapRover 服务器上的 SSH key，用于 SSH 到第二台服务器。在 Linux 上，它位于 `/home/yourusername/.ssh/id_rsa`
- Node type：描述新服务器的角色。如果你不熟悉 Docker，使用 `worker`。更多细节见 https://docs.docker.com/engine/swarm/how-swarm-mode-works/nodes/

现在，打开 Captain 的 “Cluster” 部分，把这些值填入 “Nodes” 区域的字段，然后点击 Join Cluster。完成。你现在拥有了一个真正的集群。你可以把实例数改成 6，Captain 会在另一台服务器上启动一些实例，同时自动做负载均衡，并在某台机器死亡时创建新实例。

leader 节点是被选为 Leader 的 manager。Captain 以及 nginx 和 Certbot（Let's Encrypt）等主要服务会运行在这个节点上。你的所有应用都会由 docker swarm 自动分配到各个节点。

注意，只有没有 “Persistent Data” 的应用才能跨节点扩展。启用了 “Persistent Data” 的应用只会运行在 1 个节点上。

### 默认 Push Registry：

Default Push Docker Registry 是一个 Docker Registry，你的应用一旦部署到服务器，就会保存在这里。

对于集群模式（超过一台服务器），你需要有一个默认 push Docker Registry。

### 设置 Docker Registry：

Docker Registry 就是仓库，集群中的不同节点可以从中下载并运行你的应用。如果你只有一台服务器（没有集群），设置 Docker Registry 几乎没有好处。

另一方面，集群必须设置并准备好 Docker Registry。要设置 Registry，打开 Captain Web 控制台，从菜单选择 Cluster，然后按说明操作。你会看到两个选项：

- 由 Captain 管理的 Docker Registry。
- 由第三方提供商管理的 Docker Registry。

大多数情况下，由 Captain 管理的 Registry 就足够了。注意，在从单节点切换到集群之前，如果你有任何现有应用，必须先设置 Registry，并重新部署所有现有应用，以确保它们被推送到 registry，并对所有节点可用，而不仅仅是主 leader 节点。

### 多个 Registry：

你可以同时连接到多个 registry。例如，你可能同时连接到 AWS 上的私有 Docker Registry 和 DockerHub 上的私有 Docker Registry，因为有些应用（镜像）存在 AWS 私有 registry，有些存在 DockerHub。

即便如此，你只能有一个默认 push registry。这是镜像在服务器上构建完成后会被推送到的 registry。

### 禁用 Registry：

在任何时候，你都可以选择：

- Disable Registry
- Delete Registry Auth Details

不过要注意，如果你有集群（超过一台服务器），删除 docker registry 可能导致应用表现异常。

### 添加私有 Docker Registry：

如果你需要从私有 docker registry（例如 ghcr.io 或 dockerhub 等）拉取镜像，需要向 CapRover 提供凭据，它才能拉取镜像。例如对于 ghcr.io，你需要：

- Username：`<your github username>`
- Password：[你创建的 personal token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) - 至少确保它有 read packages 权限。
- Domain：`ghcr.io`
- Image Prefix：`<your github username>`（必须是小写）

如果 Docker 镜像以 `your-username/your-image` 存储，就把 github 用户名用作 image prefix。否则，如果你在 github 有一个组织，镜像以 `my-org/my-image` 存储，就把 `my-org` 用作 image prefix。

你可以在 **Cluster** 菜单下设置凭据。如果你只打算拉取镜像，确保禁用 **Pushing New Images**
