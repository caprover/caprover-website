---
id: index
title: 持久化存储
slug: /data-persistence
---

<span id="source-data-persistence-stateless-persistent"></span>

## 何时需要持久化

- 数据库和需要保存本地上传文件的应用，应启用 **Has Persistent Data**。
- 只有显式配置了挂载的路径，才能在容器替换后保留数据。单纯启用持久化开关并不会保存容器内所有文件。
- 无状态 Web 应用可以使用外部数据库或对象存储。

<span id="source-data-persistence-volumes"></span>

## Docker 数据卷

- 设置**数据卷名称**以及应用在容器内写入数据的路径。
- PostgreSQL 常用 `/var/lib/postgresql/data`；具体路径请根据镜像文档确认。
- 当前 CapRover 使用用户指定的数据卷名称。1.15 之前创建的旧卷可能带有 `captain--` 前缀，可通过 `docker volume ls` 检查。

删除应用后，如果需要排查遗留数据卷：

```bash
docker volume ls
docker volume inspect VOLUME_NAME
docker ps -a --filter volume=VOLUME_NAME
```

确认数据卷的归属、已不再被使用并且存在备份后，才能执行 `docker volume rm VOLUME_NAME`。不要在共享服务器上随意运行 `docker volume prune`。

<span id="source-data-persistence-bind-mounts"></span>

## Bind mount

- 将宿主机绝对路径映射到容器路径，例如 `/srv/app/uploads` → `/app/uploads`。
- 先创建宿主机目录，并为容器内运行的用户配置正确的文件权限。
- 不要将宿主机敏感目录挂载到不可信容器中。

<span id="source-applications-persistent-directories"></span>

## 持久化目录

- 在应用的 **Persistent Directories** 设置中配置挂载路径。
- 确认运行中的应用确实写入已挂载的**容器路径**。
- 挂载数据需要单独备份，CapRover 配置备份不包含这些数据。

<span id="source-data-persistence-node-placement"></span>

## 节点调度

- 命名卷和 bind mount 通常属于**单个节点的本地存储**。
- CapRover 会将持久化应用固定到存储所在节点。不同节点上相同的目录名不代表内容会自动同步。
- 迁移持久化应用时，应停止写入、备份并迁移数据、确认权限、修改节点调度，然后验证恢复后的数据。

<span id="source-guides-persistent-storage"></span>

## 持久化验证

在挂载目录中写入测试文件，重新部署应用后检查文件是否还在。数据库则应使用数据库专用的导出或备份机制。

跨节点共享存储参阅[共享存储](shared-storage.md)，备份和迁移参阅[持久化数据备份](backup-data.md)。
