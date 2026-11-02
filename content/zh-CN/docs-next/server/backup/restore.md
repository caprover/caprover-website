---
id: restore
title: 恢复 CapRover 服务器
slug: /server/backup/restore
---

## 恢复前的准备

- **服务器：** 准备全新的主机，安装 Docker，配置 SSH，并预留足够的磁盘空间存放和解压备份文件。
- **防火墙：** 初始化期间放行 SSH、`80/tcp`、`443/tcp` 和 `3000/tcp`。
- **集群：** 准备可信的 [Swarm 和 registry 网络端口](../../reference/ports.md)。
- **应用数据：** 先阅读[备份内容说明](index.md)，并准备数据库和 Docker 数据卷的独立备份。

**重要：运行 CapRover 安装命令之前，必须先将备份文件放在 `/captain/backup.tar`。** 安装程序会在启动时检测该文件。

## 恢复步骤

1. 将备份文件复制到新服务器：

   ```bash
   ssh root@NEW_IP 'mkdir -p /captain'
   scp backup.tar root@NEW_IP:/captain/backup.tar
   ```

2. 在新服务器上启动 CapRover：

   ```bash
   sudo docker run -p 80:80 -p 443:443 -p 3000:3000 \
     -e ACCEPTED_TERMS=true \
     -v /var/run/docker.sock:/var/run/docker.sock \
     -v /captain:/captain \
     caprover/caprover
   ```

   还没有安装 Docker？先参阅[快速入门](../../get-started.md)。

3. 检查安装日志。恢复多节点集群时，根据提示执行[多节点恢复](restore.md)，完成节点映射。
4. 准备切换时，将原有 wildcard DNS 指向新服务器。如果新旧服务器要同时运行，请给副本设置不同的根域名。
5. 分别恢复数据库文件、Docker 数据卷和 bind mount。如果某些镜像不存在，需要重新部署相关应用。
6. 完全切换流量前，检查 dashboard 登录、HTTPS、服务运行情况和实际应用数据。

新服务器验证成功前，保留旧服务器和所有备份。

<span id="source-server-backup-multi-node-restore"></span>

## 多节点恢复

为新的 manager 节点和各替换 worker 节点安装 Docker，确保网络互通，并为旧节点上的持久化数据准备迁移方案。在新 manager 上按照[恢复服务器](restore.md)的步骤操作。

- 恢复多节点备份时，安装程序首次运行可能会**正常退出**并生成 `/captain/restoring/restore-instructions.json`。
- 检查其中的 `oldNodesForReference` 和 `nodesMapping`。
- 将每个旧 worker 节点对应的 `newIp` 占位符修改为替换节点的 IP。
- 保留 manager 的 `CURRENT_NODE_DONT_CHANGE` 映射，不要修改。
- 文件中也包含各 worker 的 SSH `user` 和 `privateKeyPath`。配置 SSH 权限，并将所需私钥安全复制到指定位置（默认 `/captain/id_rsa`）。

- 在新 manager 上**再次执行完全相同的安装命令**。
- 安装程序会检查与 worker 节点的 SSH 连接，并将原有节点调度映射到替换节点。
- 恢复完成后，删除临时复制的私钥。
- 分别恢复各节点的数据卷和 bind mount，确认 registry 可访问，必要时重新部署镜像，再检查节点调度和服务运行情况。
- 完成全部验证之前，切勿将生产 DNS 指向新集群。

<span id="source-server-move-server"></span>

## 将 CapRover 迁移到另一台服务器

- 在原服务器上[创建 CapRover 备份](index.md)，并另外备份各应用的数据卷、数据库和上传文件。
- 记录根域名、DNS 记录、registry 地址、自定义端口及应用所在节点。
- 为新服务器准备 Docker 和网络端口。按照[恢复 CapRover 备份](restore.md)操作；如果是集群，则参阅[多节点恢复](restore.md)。
- 恢复应用数据，确认镜像可访问或重新部署，检查 dashboard 和应用功能。
- 准备切换时，将 wildcard DNS 和 dashboard 域名指向新地址，等 DNS 生效后检查 HTTPS。
- 新服务器完成恢复验证之前，保留旧服务器。
