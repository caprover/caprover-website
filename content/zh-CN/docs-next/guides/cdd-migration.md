---
id: cdd-migration
title: 从DuckDuck上尉的移民
slug: /guides/cdd-migration
---

达克达克上尉是卡普罗弗的前身. 将此迁移规划为维护操作:记录运行服务,采取完整的主机快照和应用数据备份,并保持回滚路径.

- 旧文件与 `dev-scripts/migrate-from-cdd.sh`,但脚本是 **目前 CapRover 寄存器不存在**.
- 不要对生产服务器运行旧的单线迁移命令 。
- 保存旧服务器或完整快照,包括 `/captain` 和应用程序量,并提供单独的当前 CapRover 安装。
- 在新服务器上盘点和重新部署每个应用程序,分别恢复其数据,然后在移动DNS前进行测试.
- 来自现代服务器的 CapRover 备份不是 Captain DuckDuck 状态的文档导入格式 。

- 检查每个 `captain-definition`: CapRover 使用 schema 版本 2 和 Docker 文件 `COPY` 路径可能需要从历史中更新 `./src/` 前缀。
- 通过应用程序设置配置容器 HTTP 端口 。
- 在结束维护窗口前,检查dashboard,应用路线,持久化数据,以及HTTPS.
- 换到新硬件,也跟着 [移动 CapRover](../server/backup/restore.md) 用于当前服务器边的程序。
