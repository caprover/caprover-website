---
id: app-configuration
title: 应用配置参考
slug: /reference/app-configuration
---

CapRover 将应用设置与 Captain Definition 分开保存。[应用数据模型](https://github.com/caprover/caprover/blob/master/src/models/AppDefinition.ts)包括：

| 分类 | 保存的字段 | 作用 |
| --- | --- | --- |
| 应用身份 | `projectId`、`description`、`tags` | 项目组织与标签。 |
| 部署 | `deployedVersion`、`versions`、`captainDefinitionRelativeFilePath` | 部署历史与定义文件路径。 |
| HTTP | `notExposeAsWebApp`、`containerHttpPort`、`forceSsl`、`hasDefaultSubDomainSsl`、`websocketSupport`、`customDomain`、`redirectDomain`、`httpAuth`、`customNginxConfig` | 路由和访问控制。 |
| 节点调度 | `hasPersistentData`、`nodeId`、`instanceCount`、`networks` | 持久化和 Swarm 调度。 |
| 运行时 | `envVars`、`ports`、`volumes`、`serviceUpdateOverride`、`preDeployFunction` | 环境变量、发布端口、挂载和高级配置。 |

- 环境变量以 `{key,value}` 键值对保存。
- 发布端口包含 `hostPort`、`containerPort`、可选的 `protocol`（`tcp` 或 `udp`）以及可选的 `publishMode`（`ingress` 或 `host`）。
- 持久化目录包含 `containerPath`，可选的 `hostPath` 或 `volumeName`，以及可选的 `mode`。
- 应通过 dashboard 或 API 修改这些配置，不建议手动编辑存储的 JSON。

<span id="source-reference-defaults-limits"></span>

## 默认值与限制

以下是 [CaptainConstants.ts](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) 和 [EnvVars.ts](https://github.com/caprover/caprover/blob/master/src/utils/EnvVars.ts) 中的部分默认值：

| 配置项 | 默认值 |
| --- | --- |
| CapRover 状态目录 | `/captain`；备份数据位于 `/captain/data` |
| 宿主机 HTTP、HTTPS 和管理端口 | `80`、`443`、`3000` |
| dashboard 子域名 | `captain` |
| API 版本 | `v2` |
| Docker 日志默认大小 | `512m` |
| 构建日志行数和应用日志 tail 行数 | 分别为 `50` 和 `500` |
| 保存的部署版本上限 | `50` |
| Docker 构建版本选择器 | `2` |
| 关闭定时镜像清理时的保留数量 | `1` |

以上是源码默认值，不保证每个实例都使用相同配置。默认值可能被覆盖，也可能随版本变化。自动化前请核对实际版本与对应源码。

<span id="source-reference-legacy-compatibility"></span>

## 旧版兼容性

- CapRover 保留了前身 CaptainDuckDuck 的部分历史命名和链接。
- 当前预览阶段仍保留已有的 `/docs/*` 路径。旧路径与新路径的映射参阅[草案 URL 对照表](https://github.com/caprover/caprover-website/blob/master/DOCS_NEXT_URL_MAP.md)。
- 重定向会在后续正式切换时处理。

- Captain Definition 解析器支持 **`schemaVersion: 2`**。
- 旧定义可能需要迁移；参阅[从 CaptainDuckDuck 迁移](../guides/cdd-migration.md)。
- 对 CapRover 1.15.0 之前创建的应用，模型保留了 `isLegacyAppName` 字段，可能影响 service 命名兼容性。
- 修改写死的内部主机名之前，请阅读[内部网络](../domains/firewall.md)。

预览阶段应保留已有 URL 与旧 service 别名。正式切换时逐一验证历史链接和已经部署的应用。
