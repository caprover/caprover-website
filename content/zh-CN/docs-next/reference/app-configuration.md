---
id: app-configuration
title: App 配置
slug: /reference/app-configuration
---

CapRover 存储应用程序设置与 Captain Definition 分开 。 这个 [应用程序模式](https://github.com/caprover/caprover/blob/master/src/models/AppDefinition.ts) 包括:

| 区域 | 已保存的字段 | 目的 |
| --- | --- | --- |
| 身份 | `projectId`, `description`, `tags` | 组织和标签。 |
| 部署 | `deployedVersion`, `versions`, `captainDefinitionRelativeFilePath` | 版本历史与定义路径. |
| HTTP 软件 | `notExposeAsWebApp`, `containerHttpPort`, `forceSsl`, `hasDefaultSubDomainSsl`, `websocketSupport`, `customDomain`, `redirectDomain`, `httpAuth`, `customNginxConfig` | 修行及通达. |
| 节点调度 | `hasPersistentData`, `nodeId`, `instanceCount`, `networks` | 坚韧和Swarm的放置。 |
| 运行时间 | `envVars`, `ports`, `volumes`, `serviceUpdateOverride`, `preDeployFunction` | 环境、已公布的端口、挂载和服务定制。 |

- 一个环境变量是一个 `{key,value}` 双人
- 已公布的端口 `hostPort`, `containerPort`选项 `protocol` (`tcp` 或 `udp`)和可选 `publishMode` (`ingress` 或 `host`).
- 一个持久目录包含 `containerPath`选项 `hostPath` 或 `volumeName`选择 `mode`.
- 通过dashboard或API配置这些,而不是手版存储的JSON.

<span id="source-reference-defaults-limits"></span>

## 默认和限制

选中的默认从 [队长](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) 和 [信封瓦尔茨](https://github.com/caprover/caprover/blob/master/src/utils/EnvVars.ts):

| 设置 | 默认 |
| --- | --- |
| CapRover 状态目录 | `/captain`; 备份数据 `/captain/data` |
| 主机 HTTP, HTTPS, 管理员端口 | `80`, `443`, `3000` |
| 答盘子域 | `captain` |
| API 版本 | `v2` |
| 默认嵌入日志大小 | `512m` |
| 构建日志行和应用程序日志尾巴 | `50` 和 `500` 分别为: |
| 最大保存的部署版本 | `50` |
| Docker 构建版本选择器 | `2` |
| 禁用时计划保存镜像清除 | `1` |

这些是源默认,不是每个安装的保证;值可以被推翻,并且可以通过释放而改变. 请检查您实例的版本和匹配源, 然后再自动对应它们 。

<span id="source-reference-legacy-compatibility"></span>

## 遗产兼容性

- CapRover有其DuckDuckCaptain前身的历史名称和链接.
- 现有 `/docs/*` 路径在此预览期间仍然有效; 参见 [URL 地图草稿](https://github.com/caprover/caprover-website/blob/master/DOCS_NEXT_URL_MAP.md) 用于拟议的旧到新目的地。
- 重新定向属于后来的切换审查.

- Captain Definition解析器接受 **`schemaVersion: 2`**.
- 旧的定义需要迁移;见 [DuckDuck队长的迁移](../guides/cdd-migration.md).
- 应用模式保留 `isLegacyAppName` 用于在 CapRover 1.15.0 之前创建的应用程序,这影响了服务名称兼容性。
- 检查 [内部网络](../domains/firewall.md) 在更改硬码内部主机名之前。

不删除已有的 URL 或 遗留服务别名作为预览发布的一部分 。 测试每个历史链接,并在最终切换时部署应用.
