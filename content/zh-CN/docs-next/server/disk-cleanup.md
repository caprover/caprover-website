---
id: disk-cleanup
title: 磁盘与镜像清理
slug: /server/disk-cleanup
---

- 在 dashboard 的磁盘清理设置中，可以选择为每个应用保留多少个**最近部署的版本**。
- CapRover 的 `DiskCleanupManager` 会扫描 Docker 镜像，保留当前部署的镜像，以及 tag 与部署历史匹配的前 `mostRecentLimit` 个版本。
- 然后尝试删除不在保留范围内的镜像。

- 要定时执行清理，请填写合法的 **cron 表达式**和**时区**。
- 调度器按照所选时区运行。
- 清空 cron 表达式会禁用定时清理，保存的版本保留数量会重置为 1。
- 不能设置负数的保留数量。
- 删除旧镜像前，确认之后可以从 registry 重新拉取或重新构建；清理可能影响回滚能力。

- 此功能仅清理 **Docker 镜像**，不会清理数据库、数据卷、日志或 registry。
- 手动清理前先运行 `docker system df` 和 `docker volume ls` 了解使用情况。
- 避免直接清理所有未使用的数据卷；停机或故障应用的数据可能仍保存在这些卷中。
- 参阅[备份内容](backup/index.md)。
