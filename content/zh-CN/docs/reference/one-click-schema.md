---
id: one-click-schema
title: One-Click 应用配置 Schema
slug: /reference/one-click-schema
---

One-Click 模板由类似 Docker Compose 的 `services` 映射，以及 `captainVersion` 和 `caproverOneClickApp` 组成。[源码类型定义](https://github.com/caprover/caprover/blob/master/src/models/IOneClickAppModels.ts)包含以下元数据：

| 字段 | 类型 |
| --- | --- |
| `caproverOneClickApp.displayName` | 字符串 |
| `caproverOneClickApp.instructions.start`、`.end` | 字符串 |
| `caproverOneClickApp.variables` | 变量定义数组 |
| 变量的 `id`、`label` | 必填字符串 |
| 变量的 `defaultValue`、`validRegex`、`description` | 可选字符串 |

- 每个服务支持的配置范围见 [Compose 支持子集](../deployments/other/docker-compose.md)。
- 部署时，CapRover 会将 One-Click 变量替换到模板中。输入值可能包含敏感信息，应检查变量替换后的结果。
- 如果模板声明了 `$$cap_appname`，必须为它提供非空值。
- 具体操作和真实案例参阅 [One-Click 模板编写指南](../one-click-apps/authoring.md)。
