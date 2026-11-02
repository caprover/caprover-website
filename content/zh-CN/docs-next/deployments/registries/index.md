---
id: index
title: 镜像仓库
slug: /deployments/registries
---

<span id="source-deployments-registries-private"></span>

## 私人注册

- CapRover 当一个 Docker 镜像为私有时需要注册证书 。
- 在dashboard上 **集群/注册** 区域中,添加带有其域名、用户名、密码或读取符号以及可选镜像前缀的远程注册。
- CapRover 匹配从开始的镜像名称对映证书 `DOMAIN/PREFIX/` 当设置前缀时,或 `DOMAIN/` 当它是空白的。
- 它还在为默认的推器注册标签 CapRover 构建的镜像时使用前缀.
- 在依赖这些证书之前验证完整的镜像名称 。

- 对于 `ghcr.io/my-org/my-api:tag`,使用注册域 `ghcr.io` 和匹配的拥有者或组织路径作为镜像前缀,并允许证书读取该软件包。
- 对于 `registry.gitlab.com/my-group/my-project/image:tag`,使用匹配的 GitLab 注册路径和范围读取证书。

- 使用符合注册资格的完整名称部署一个镜像,并可以在每个预定的节点上进行验证。
- 从 CI 驱动一个镜像不会自动认证 CapRover 来拉它 。
- 如果您只需要拉动预建的镜像, 请不要选择此注册为 CapRover 构建的镜像的默认 push注册 。

<span id="source-deployments-registries-default-push"></span>

## 默认 push registry

- 这个 **默认 push registry** 存储镜像 CapRover 构建, 这样其他 Swarm 节点就可以拉它们 。
- 在dashboard的集群/注册设置中选择一个可达到的注册并配置其证书.
- 一个单节点服务器可以不设一个运行;CapRover需要默认的push registry,然后才能通过其集群工作流程添加另一个节点.

- 如果在配置注册前已经构建了应用程序, 请将这些应用程序重新部署到新的节点上,
- 在添加worker之前, 验证新部署成功 。
- 在推出和回收期间保持registry的可用性;取消或删除集群中的证书可以防止节点拉动应用镜像.

使用一个 [自办registry](index.md) 或适当的远程注册处。 预建镜像的拉动证书是单独需要的,不需要默认推.

<span id="source-deployments-registries-self-hosted"></span>

## 自设镜像仓库

- CapRover可以为自己的集群管理一个Docker注册.
- 在dashboard的集群/注册区域配置它,然后在您计划添加节点时选择它作为默认的推动注册.
- 请检查每个节点在部署整个集群之前可以到达注册处.

- CapRover 自动托管的注册使用端口 `996/tcp` 用于注册访问。
- 仅在客户端或节点需要时才曝光,并以配置的认证保护它.
- 同一物理服务器上的注册仍然是依赖性:如果该服务器或其镜像存储无法使用,新的节点可能无法拉动镜像.

在启用默认 push后, 将已有的已建应用程序重新部署到发布其镜像 。 那就跟着 [多节点设置指南](../../scaling/multi-node.md) 添加和验证worker。
