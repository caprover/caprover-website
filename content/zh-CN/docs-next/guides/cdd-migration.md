---
id: cdd-migration
title: 从 CaptainDuckDuck 迁移
slug: /guides/cdd-migration
---

CaptainDuckDuck 是 CapRover 的前身。应把迁移作为维护操作来规划：记录正在运行的服务，创建完整的宿主机快照，备份应用数据，并准备好回滚方案。

- 旧版文档曾引用 `dev-scripts/migrate-from-cdd.sh`，但该脚本**已不在当前 CapRover 仓库中**。
- 不要在生产服务器上执行旧文档中的单行迁移命令。
- 保留原服务器或完整快照，包括 `/captain` 和应用数据卷；另外部署一套新版 CapRover。
- 逐个盘点并在新服务器部署应用，分别恢复应用数据，充分测试后再切换 DNS。
- 现代 CapRover 的备份文件并没有文档保证可以直接导入 CaptainDuckDuck 的配置。

- 检查每个 `captain-definition`：CapRover 使用 schema version 2，Dockerfile 中的 `COPY` 路径可能需要去掉旧的 `./src/` 前缀。
- 在应用设置中配置容器 HTTP 端口。
- 维护窗口结束前，验证 dashboard、应用路由、持久化数据和 HTTPS。
- 如果同时迁移到新服务器，现有 CapRover 环境的操作流程还需参考[迁移 CapRover](../server/backup/restore.md)。
