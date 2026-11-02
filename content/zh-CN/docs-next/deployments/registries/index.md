---
id: index
title: 容器镜像仓库
slug: /deployments/registries
---

<span id="source-deployments-registries-private"></span>

## 私有 Registry

- 拉取私有 Docker 镜像时，CapRover 需要对应的 registry 凭据。
- 在 dashboard 的 **Cluster / Registries** 中添加远程 registry，填写域名、用户名、密码或只读 token，以及可选的镜像前缀。
- 如果设置了前缀，CapRover 会将 pull 凭据匹配到以 `DOMAIN/PREFIX/` 开头的镜像名；未设置前缀时则匹配 `DOMAIN/`。
- 将 CapRover 构建的镜像标记到默认 push registry 时也会使用这个前缀。
- 使用凭据前先核对完整的镜像名称。

- 例如 `ghcr.io/my-org/my-api:tag`，registry 域名应为 `ghcr.io`，镜像前缀为对应 owner 或组织路径，凭据必须具有读取该 package 的权限。
- 对 `registry.gitlab.com/my-group/my-project/image:tag`，使用匹配的 GitLab registry 路径以及最小范围的读取凭据。

- 部署时使用完整的 registry 镜像名，并确保每个目标节点都能够拉取该镜像。
- CI 成功推送镜像，并不会自动让 CapRover 获得拉取权限。
- 如果只需要拉取预构建镜像，无需将该 registry 设置为 CapRover 构建镜像的默认 push registry。

<span id="source-deployments-registries-default-push"></span>

## 默认 Push Registry

- **default push registry** 用于存储 CapRover 构建的镜像，让其他 Swarm 节点可以拉取。
- 在 dashboard 的 **Cluster / Registries** 中选择所有节点都能访问的 registry，并配置凭据。
- 单节点服务器可以不配置它。通过 CapRover 的集群向导添加新节点之前，必须先设置 default push registry。

- 如果应用在配置 registry 之前已经构建过，需要重新部署这些应用，将镜像推送到 registry 供新节点拉取。
- 添加 worker 前，先验证一次新部署能够成功推送镜像。
- 部署和故障恢复期间需要持续访问 registry。删除或禁用凭据，可能导致集群节点无法拉取应用镜像。

可以使用[自托管 registry](index.md)或其他远程 registry。仅用于拉取预构建镜像的凭据与默认 push registry 是两个独立需求。

<span id="source-deployments-registries-self-hosted"></span>

## 自托管 Registry

- CapRover 可以为自己的集群管理 Docker registry。
- 通过 dashboard 的 **Cluster / Registries** 配置。如果计划添加节点，可以将其选为 default push registry。
- 跨节点部署应用之前，先确保所有节点均能访问 registry。

- CapRover 自托管 registry 使用 `996/tcp` 端口。
- 只向需要访问的客户端或集群节点开放该端口，并启用适当的身份验证。
- 即使 registry 和 CapRover 位于同一台物理服务器，也存在单点依赖。如果服务器或镜像存储不可用，新节点可能无法拉取镜像。

开启 default push 后，重新部署之前构建的应用以发布镜像，然后按照[多节点部署指南](../../scaling/multi-node.md)添加并验证 worker。
