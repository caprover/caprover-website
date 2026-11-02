---
id: index
title: 持久性储存
slug: /data-persistence
---

<span id="source-data-persistence-stateless-persistent"></span>

## 何时使用持久性

- 使用 **有持久性数据** 用于存储本地上传的数据库和应用程序。
- 只有已配置的挂载路径在容器替换中幸存 。 仅使用持久应用的旗帜并不能保存任意的容器文件.
- 无国籍的网络应用可以使用外部数据库或对象存储.

<span id="source-data-persistence-volumes"></span>

## 嵌入量

- 设定 **音量名称** 和应用程序的容器路径 。
- PostgreSQL 常用软件 `/var/lib/postgresql/data`; 验证您图像的路径。
- 当前 CapRover 版本使用您输入的音量名称 。 旧卷(1.15以前) `captain--` 前缀; 检查为 `docker volume ls`.

要检查应用程序删除后的孤卷 :

```bash
docker volume ls
docker volume inspect VOLUME_NAME
docker ps -a --filter volume=VOLUME_NAME
```

只有在确认所有权、不使用和备份后,才删除 `docker volume rm VOLUME_NAME`。避免宽泛 `docker volume prune` 在共享主机上。

<span id="source-data-persistence-bind-mounts"></span>

## 捆绑挂载

- 将一个绝对主机目录映射到容器路径, 例如 `/srv/app/uploads` → `/app/uploads`.
- 为容器用户创建主机路径并设置权限 。
- 避免将敏感的主机目录暴露于不信任的容器.

<span id="source-applications-persistent-directories"></span>

## 持久性目录

- 在应用程序中配置挂载路径 **持久性目录** 设置。
- 校验运行中的应用程序写入 **容器路径** 你骑。
- 从 CapRover 配置备份中单独备份挂载的数据 。

<span id="source-data-persistence-node-placement"></span>

## 节点位置

- 命名的卷和捆绑山通常 **节点本地**.
- CapRover在节点上标注了持续的应用 保存着数据 不同节点上的相同目录名称并不意味着共享内容.
- 当移动一个持久性的应用程序时:停止写入,备份,迁移数据,验证权限,更改位置,然后验证恢复的数据.

<span id="source-guides-persistent-storage"></span>

## 存储测试

将一个代表性文件写入挂载路径, 重新部署应用程序, 并验证它是否还剩 。 对于数据库,使用了解数据库的导出/备份。

关于跨节点共享存储,参见 [共享存储](shared-storage.md)。关于备份和迁移,参见 [备份持久数据](backup-data.md).
