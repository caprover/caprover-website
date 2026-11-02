---
id: docker-compose
title: Docker 编译( 实验)
slug: /deployments/other/docker-compose
---

- **实验:** CapRover的仪表板可以将一个有限的Docker Compose子集导入到管理的应用中.
- 打开 **Apps – Docker 编曲**,粘贴YAML,审查生成的应用程序,并部署.
- 请检查每个应用程序的 HTTP 端口, 环境变量, 持续数据, 以及之后曝光的端口 。

- 当前解析器识别 `image`, `environment`, `ports`, `volumes`, `depends_on`, `hostname`, `cap_add`,以及 `command`.
- 其他编曲字段被忽略 。
- 尤其是,不要假定 `build`,自定义 `networks`, `secrets`, `configs`, `deploy`, `restart`,或 `container_name` 行为就像 `docker compose`.

命名的卷通过生成的 CapRover 应用管理 。 端口映射需要一个 `HOST:CONTAINER` 表单。 对于需要不支持的Compose行为的堆栈,分别运行Compose,并明确将服务与CapRover的外部连接 `captain-overlay-network` 只有在需要的时候 CapRover以外的服务仍然处于其应用生命周期和备份行为之外。 见 [支持矩阵](docker-compose.md).

<span id="source-reference-docker-compose"></span>

## Docker 编译支持矩阵

CapRover 的单点击格式接受一个 **子集** 包含 Docker 编译服务设置; 它不是一个常规 `docker compose up` 替换。 这个 [模型](https://github.com/caprover/caprover/blob/master/src/models/IOneClickAppModels.ts) 声明:

| 服务密钥 | 支持的投入 |
| --- | --- |
| `image`, `command`, `hostname`, `cap_add` | 图像和选中的容器选项 。 |
| `volumes` | 字符串挂载; 检查目标路径和持久性 。 |
| `ports` | 字符串主机:容器对. |
| `environment` | 将变量名称映射到字符串值 。 |
| `depends_on` | 用于命令 One-Click 部署的服务名称阵列 。 |
| `caproverExtra` | CapRover 扩展名 `dockerfileLines`, `containerHttpPort`, `notExposeAsWebApp`,以及 `websocketSupport`. |

- 部署助手将这些值映射到应用程序中, 并将所选附加的 Confose 选项转换为服务覆盖 。
- 检查确切的行为 [OneClickApp部署助手.ts](https://github.com/caprover/caprover/blob/master/src/user/oneclick/OneClickAppDeploymentHelper.ts) 并在一次性安装中测试模板。
- 模型中缺失的编译密钥不承诺工作.
