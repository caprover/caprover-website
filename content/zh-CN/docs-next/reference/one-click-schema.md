---
id: one-click-schema
title: 单击 App Schema
slug: /reference/one-click-schema
---

单点模板是类似Confose的 `services` 绘图加 `captainVersion` 和 `caproverOneClickApp`编辑 [源类型](https://github.com/caprover/caprover/blob/master/src/models/IOneClickAppModels.ts) 定义元数据 :

| 外地 | 类型 |
| --- | --- |
| `caproverOneClickApp.displayName` | 字符串 |
| `caproverOneClickApp.instructions.start`, `.end` | 字符串 |
| `caproverOneClickApp.variables` | 一系列可变定义 |
| 变量 `id`, `label` | 需要的字符串 |
| 变量 `defaultValue`, `validRegex`, `description` | 可选字符串 |

- 每个服务支持 [组成子集](../deployments/other/docker-compose.md).
- 在部署时,在模板中替换了单点变量;将提交的值视为敏感值和测试替代值。
- 若为 `$$cap_appname` ,需要非空值。
- 见 [单点写作](../one-click-apps/authoring.md) 用于任务指南和真实实例。
