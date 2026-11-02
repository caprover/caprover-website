---
id: index
title: One-Click 应用
slug: /one-click-apps
---

<span id="source-one-click-apps-install"></span>

## 安装

One-Click 模板会创建普通的 CapRover 应用。一个模板可以同时部署多个服务。

- 安装前检查模板所需的变量、镜像、开放端口、数据卷以及安装后的操作说明。
- 为数据库和管理员账户设置独立的凭据。
- 持久化服务必须**另外备份应用数据**。CapRover 的配置备份不包含数据库数据卷。
- 实际可用的模板和版本以 dashboard 中的实时目录为准。

<span id="source-one-click-apps-configure"></span>

## 配置

- 通过 CapRover 的常规应用设置即可管理模板生成的应用。
- 某些变量（例如数据库初始密码）**仅在首次启动时**生效。之后修改环境变量，不一定会更新已存在的数据库用户密码。

<span id="source-one-click-apps-connect"></span>

## 服务间连接

- 内部连接示例：`postgres:5432`。请使用实际生成的服务名和监听端口。
- 旧版本创建的应用可能仍支持 `srv-captain--` 服务别名。
- 将数据库等服务的凭据保存在调用方应用的环境变量中。
- 如果需要从 CapRover 外部访问数据库，参阅[从外部连接数据库](../data-persistence/deploy-databases.md)。

<span id="source-one-click-apps-upgrade"></span>

## 更新

- 更新前阅读对应上游项目的迁移说明，并备份数据。
- 模板可能使用自定义镜像或初始化脚本。直接替换为上游原版镜像可能导致必要配置丢失。
- 更换镜像不会自动执行全部数据库或应用 schema 迁移。
- 重建或迁移有状态应用时，保留并验证已有数据卷。

<span id="source-one-click-apps-custom-repositories"></span>

## 自定义模板仓库

CapRover 支持加载第三方 One-Click 模板仓库。

- 部署前审查模板，因为它可能运行镜像、开放端口、挂载存储并配置凭据。
- 记录已安装应用的模板来源，以便后续更新。
- 参阅[编写 One-Click 模板](authoring.md)了解如何创建模板。

<span id="source-one-click-apps-troubleshooting"></span>

## 故障排查

先找到发生故障的服务，检查其日志及以下项目：

- 模板变量、镜像 pull/build 错误和凭据。
- 端口映射、内部服务名、数据卷挂载和任务调度。
- 数据库是否意外使用另一个节点上的空本地数据卷启动。

排查期间保留有状态数据卷。寻求帮助时，请提供已移除敏感信息的服务日志、模板名称和镜像版本。
