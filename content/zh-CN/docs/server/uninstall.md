---
id: uninstall
title: 卸载 CapRover
slug: /server/uninstall
---

卸载前，请先导出一份 [CapRover 备份](backup/index.md)，并单独备份每个应用的数据。记录 DNS 和镜像 registry 的依赖关系。删除 CapRover 或相关 Docker 资源可能导致应用停止服务。

CapRover 没有能够自动判断哪些应用数据和其他 Swarm 服务应当保留的一键卸载命令。如果要退役一台**专用于 CapRover** 的服务器，请按以下步骤操作：

1. 在 dashboard 中逐个删除或迁移应用，记录实际 Docker service 名称，并保留需要的数据卷和 bind mount。确认没有客户端继续依赖对应域名或公开端口。
2. 运行 `docker service ls`，识别 CapRover 核心服务（`captain-captain`、`captain-nginx`、`captain-certbot`，以及可能存在的 registry）。使用 `docker service rm SERVICE_NAME` **仅删除确定要移除的服务**。不要在共享 Swarm 集群上运行 `docker service rm $(docker service ls -q)`，否则其他应用也会被删除。
3. 确认已有经过恢复测试的异机备份后，再检查 `/captain` 和 `docker volume ls` 的输出。只删除明确不再需要的数据目录和数据卷。即使没有容器运行，数据卷中也可能仍有重要数据。
4. 清理不再使用的 DNS 记录、端口转发和防火墙规则。**仅在**这台服务器确实要退出 Swarm 且没有其他服务依赖它时，才执行 `docker swarm leave --force`。如果是多节点集群，先从其他节点确认状态。

- 在替代系统完成恢复验证前，请保留备份和 registry 中的镜像。
- 谨慎使用 `docker system prune --all`：它可能删除其他应用或回滚流程仍需要的镜像。
