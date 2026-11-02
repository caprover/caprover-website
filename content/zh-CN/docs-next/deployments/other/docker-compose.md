---
id: docker-compose
title: Docker Compose（实验性功能）
slug: /deployments/other/docker-compose
---

- **实验性功能：**CapRover 的 dashboard 可以导入部分 Docker Compose 配置，并创建由 CapRover 管理的应用。
- 打开 **Apps → Docker Compose**，粘贴 YAML，检查生成的应用后再部署。
- 部署后，逐一确认应用的 HTTP 端口、环境变量、持久化数据和对外开放的端口。

- 当前解析器支持 `image`、`environment`、`ports`、`volumes`、`depends_on`、`hostname`、`cap_add` 和 `command`。
- 其他 Compose 字段会被忽略。
- 尤其需要注意：`build`、自定义 `networks`、`secrets`、`configs`、`deploy`、`restart`、`container_name` 等字段的行为不能直接按 `docker compose` 推断。

命名卷由生成的 CapRover 应用管理。端口映射必须使用 `HOST:CONTAINER` 格式。如果需要 CapRover 暂不支持的 Compose 功能，可以单独运行 Compose，并仅在必要时将相关服务显式连接到 CapRover 的外部网络 `captain-overlay-network`。CapRover 不负责管理这些外部服务的应用生命周期或备份。详情见[支持矩阵](docker-compose.md)。

<span id="source-reference-docker-compose"></span>

## Docker Compose 支持矩阵

CapRover 的 One-Click 模板支持 Docker Compose 服务配置的一个**子集**，不能完全替代 `docker compose up`。具体支持项由[数据模型](https://github.com/caprover/caprover/blob/master/src/models/IOneClickAppModels.ts)定义：

| 服务配置项 | 支持的内容 |
| --- | --- |
| `image`、`command`、`hostname`、`cap_add` | 镜像及部分容器参数。 |
| `volumes` | 字符串形式的挂载配置；需核对容器内路径及数据持久化行为。 |
| `ports` | host:container 形式的端口映射字符串。 |
| `environment` | 环境变量名称到字符串值的映射。 |
| `depends_on` | 用于确定 One-Click 部署顺序的服务名数组。 |
| `caproverExtra` | CapRover 扩展配置，包括 `dockerfileLines`、`containerHttpPort`、`notExposeAsWebApp` 和 `websocketSupport`。 |

- 部署逻辑根据这些配置创建 CapRover 应用，并将部分额外的 Compose 选项转换为 Docker service override。
- 如需确认具体行为，请查看 [OneClickAppDeploymentHelper.ts](https://github.com/caprover/caprover/blob/master/src/user/oneclick/OneClickAppDeploymentHelper.ts)，并先在测试环境验证模板。
- 模型中未定义的 Compose 字段不保证受支持。
