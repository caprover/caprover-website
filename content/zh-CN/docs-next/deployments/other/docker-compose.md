---
id: docker-compose
title: Docker Compose( 实验)
slug: /deployments/other/docker-compose
---

- **实验:** CapRover的dashboard可以将一个有限的Docker Compose子集导入到管理的应用中.
- 打开 **Apps – Docker Compose**,粘贴YAML,审查生成的应用程序,并部署.
- 请检查每个应用程序的 HTTP 端口, 环境变量, 持久化数据, 以及之后曝光的端口 。

- 当前解析器识别 `image`, `environment`, `ports`, `volumes`, `depends_on`, `hostname`, `cap_add`,以及 `command`.
- 其他 Compose 字段被忽略 。
- 尤其是,不要假定 `build`,自定义 `networks`, `secrets`, `configs`, `deploy`, `restart`,或 `container_name` 行为就像 `docker compose`.

命名的卷通过生成的 CapRover 应用管理 。 端口映射需要一个 `HOST:CONTAINER` 格式。 对于需要不支持的Compose行为的堆栈,分别运行Compose,并明确将服务与CapRover的外部连接 `captain-overlay-network` 只有在需要的时候 CapRover以外的服务仍然处于其应用生命周期和备份行为之外。 见 [支持矩阵](docker-compose.md).

<span id="source-reference-docker-compose"></span>

## Docker Compose支持矩阵

CapRover 的One-Click 格式接受一个 **子集** 包含 Docker Compose服务设置; 它不是一个常规 `docker compose up` 替换。 这个 [模型](https://github.com/caprover/caprover/blob/master/src/models/IOneClickAppModels.ts) 声明:

| 服务配置项 | 支持的配置项 |
| --- | --- |
| `image`, `command`, `hostname`, `cap_add` | 镜像和选中的容器选项 。 |
| `volumes` | 字符串形式的挂载配置; 检查目标路径和持久化 。 |
| `ports` | `HOST:CONTAINER` 格式的字符串. |
| `environment` | 将变量名到字符串值的映射 。 |
| `depends_on` | 用于确定 One-Click 部署顺序的服务名称阵列 。 |
| `caproverExtra` | CapRover 扩展名 `dockerfileLines`, `containerHttpPort`, `notExposeAsWebApp`,以及 `websocketSupport`. |

- 部署助手将这些值映射到应用程序中, 并将所选附加的 Compose 选项转换为服务覆盖 。
- 检查确切的行为 [OneClickAppDeploymentHelper.ts](https://github.com/caprover/caprover/blob/master/src/user/oneclick/OneClickAppDeploymentHelper.ts) 并在一次性安装中测试模板。
- 模型中缺失的Compose 配置项不承诺工作.
