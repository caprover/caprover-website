---
id: restore
title: 恢复服务器
slug: /server/backup/restore
---

## 恢复前

- **服务器 :** 带有 Docker, SSH 的新主机, 以及足够归档和提取数据的磁盘
- **防火墙 :** 嘘, `80/tcp`, `443/tcp`,以及 `3000/tcp` 设置时打开
- **组数 :** 准备可信 [Swarm和注册端口](../../reference/ports.md)
- **数据 :** 读取 [什么是备份](index.md) 并获取单独的数据库和音量备份

**重要内容 :** 将归档放置于 `/captain/backup.tar` **在此之前** 运行 CapRover 安装器。 安装器在启动时检测到它.

## 恢复

1. 复制归档到新服务器 :

   ```bash
   ssh root@NEW_IP 'mkdir -p /captain'
   scp backup.tar root@NEW_IP:/captain/backup.tar
   ```

2. 在新服务器上运行 CapRover :

   ```bash
   sudo docker run -p 80:80 -p 443:443 -p 3000:3000 \
     -e ACCEPTED_TERMS=true \
     -v /var/run/docker.sock:/var/run/docker.sock \
     -v /captain:/captain \
     caprover/caprover
   ```

   需要Docker吗? 跟着 [开始](../../get-started.md) 先说

3. 注意安装日志 。 分组如下 [多节点恢复](restore.md) 用于绘制节点映射。
4. 准备好时将原通配符DNS指向新服务器. 对于与原样一起运行的克隆,请选择不同的根域.
5. 恢复数据库文件、卷和绑定挂载。 如果他们的镜像不见了,就重新部署应用程序。
6. 在完全切换流量之前,验证dashboard访问,HTTPS,服务和应用程序数据.

保留原始服务器和备份,直到验证成功.

<span id="source-server-backup-multi-node-restore"></span>

## 多节点恢复

准备新经理和每个替换worker与Docker,网络接入,以及旧节点持久化数据的计划. 跟着 [恢复服务器](restore.md) 在新经理。

- 对于多节点备份,第一个安装器运行可以故意退出并创建 `/captain/restoring/restore-instructions.json`.
- 检查它的 `oldNodesForReference` 和 `nodesMapping`.
- 每个老worker,更换占位符 `newIp` 及其替换节点 IP。
- 离开经理的 `CURRENT_NODE_DONT_CHANGE` 独自测绘.
- 文件还提供了 SSH `user` 和 `privateKeyPath` 每个worker; 安全地配置和复制所需的私人密钥到指定的路径(默认情况下) `/captain/id_rsa`).

- 重运行 **不变** 在新管理器上安装命令 。
- 安装者向worker检查SSH,地图将节点放置保存到替换器上.
- 恢复后删除复制的私钥 。
- 恢复每个节点的卷,并分别挂载,验证注册访问和重新部署无法获取的镜像,然后检查放置和服务。
- 在验证完成之前不要将生产DNS指向新集群.

<span id="source-server-move-server"></span>

## 将 CapRover 移动到另一个服务器

- 使用 [创建备份](index.md) 在源代码上备份每个应用程序的卷、数据库和分别上传的文件。
- 记录根域,DNS记录,注册位置,自定义端口,以及每个app的节点位置.

- 为目的地提供Docker和必要的端口. [恢复 CapRover 归档](restore.md),或使用 [多节点恢复](restore.md) 对于一组。
- 恢复应用数据,确认镜像可以访问或重新部署,并测试dashboard和应用程序.
- 准备时将通配符和dashboard DNS 记录更改为新地址;在 DNS 发布后检查 HTTPS 。
- 保留旧主机,直到新主机通过恢复检查为止.
