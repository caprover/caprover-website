---
id: upgrade
title: 升级 CapRover
slug: /server/upgrade
---

升级前，先[下载 CapRover 备份](backup/index.md)，并单独备份应用数据和数据卷。阅读 release notes，确认 Docker 服务器有足够的空闲磁盘空间。

- 在 dashboard 中打开 **Settings**，检查当前版本、可升级版本和更新日志。
- dashboard 提示有可用更新时，使用内置升级操作。
- CapRover 会拉取对应镜像并更新 `captain-captain` Docker service。
- 等待服务重启，然后检查 dashboard、已部署应用、registry 和 HTTPS。

- 如果升级失败，在 manager 节点执行 `docker service ps captain-captain --no-trunc` 和 `docker service logs captain-captain --tail 100`。
- 回滚前保留备份以及先前使用的镜像 tag。参阅[诊断指南](../troubleshooting/diagnostics.md)。

## 测试 edge 镜像

- 如果需要临时验证一个仅在 edge 镜像中提供的修复，先通过 `docker service inspect captain-captain` 记录当前镜像，备份 CapRover 和应用数据，然后使用 `docker service update captain-captain --image IMAGE` 更新到**明确指定且经过测试的 edge tag 或 digest**。
- 此操作绕过 dashboard 的正常版本升级流程。
- edge 镜像可能无法安全降级回当前稳定版。切换回稳定版前，应等待兼容的正式发布，或恢复经过测试的备份。
- 任何手动更新之后都要检查 dashboard、应用和 service 日志。
