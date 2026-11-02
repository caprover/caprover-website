---
id: authoring
title: 编写 One-Click 应用模板
slug: /one-click-apps/authoring
---

- One-Click 模板描述需要部署的服务，以及安装时需要用户提供的参数。
- 当前数据模型要求模板包含 `captainVersion`、`services` 映射，以及 `caproverOneClickApp` 元数据，后者定义显示名称、变量和安装前后说明。
- 服务支持文档列出的部分 Compose 配置字段，并通过 `caproverExtra` 提供 CapRover 专用的 HTTP 和构建设置。

- 谨慎选择镜像 tag，为变量提供清晰的名称和验证规则，持久化有状态服务的数据，并避免不安全的默认密码和不必要的公开端口。
- 在可丢弃的测试服务器上验证安装过程，检查生成的每个应用，确认说明正确，并同时测试全新安装和恢复流程。

- 精确的字段名称和类型请参考 [One-Click App Schema](../reference/one-click-schema.md)及当前 [one-click-apps 仓库](https://github.com/caprover/one-click-apps)。
- 应用目录会动态变化，不要在文档中保证某个固定应用列表始终可用。
