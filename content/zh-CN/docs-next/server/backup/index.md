---
id: index
title: CapRover 备份与恢复
slug: /server/backup
---

<span id="source-server-backup-contents"></span>

## 备份包含哪些内容

CapRover 备份会复制 **`/captain/data`**，并附加集群节点的元数据。该目录中的 CapRover 配置和状态会被包含在内，例如应用定义、域名配置和证书。

- 备份**不会**自动包含其他位置的 Docker 数据卷、宿主机 bind mount、数据库文件、上传文件或本地构建的 Docker 镜像。
- 对数据库应使用对应数据库支持的一致性 dump 或快照方案；对应用持久化目录也需要单独备份。
- 应实际测试能否同时恢复 CapRover 备份文件和应用数据。

- 镜像有一个例外：**自托管 registry** 的镜像数据保存在 `/captain/data/registry`，因此也会进入备份，可能显著增加文件大小。
- 使用外部 registry 时，请确保恢复阶段仍能使用其凭据，并且镜像保留策略足够。
- 如果所需镜像已不可用，恢复应用定义后还需要重新部署应用。

参阅[创建备份](index.md)、[恢复服务器](restore.md)和[持久化目录](../../data-persistence/index.md)。

<span id="source-server-backup-create"></span>

## 创建备份

1. 在 dashboard 中打开 **Maintenance → Configuration Backup**，点击 **Create Backup**。旧版 dashboard 的备份入口位于 **Settings**。
2. 下载生成的 `.tar` 文件，检查文件非空，并将其保存在服务器之外的受控存储位置。
3. 数据库和应用持久化目录需要单独备份，因为 [CapRover 备份不包含全部应用数据](index.md)。
4. 定期在测试服务器上恢复这两类备份，并验证应用可以正常运行。

- 备份文件先在服务器上生成，再通过临时下载链接提供。
- 请自行保留副本；生成的下载链接是临时的。
- 启用自托管 registry 时，应为镜像数据预留足够的备份空间。

<span id="source-server-backup-automate"></span>

## 自动化备份

- dashboard 的 **Create Backup** 操作对应一个需要身份验证的 API endpoint。
- 以下示例需要 `curl` 和 `jq`。
- 将 `CAPROVER_URL` 设置为 dashboard 的 HTTPS 地址，并通过任务调度器的 secrets 管理功能安全提供 `CAPROVER_PASSWORD`。

```bash
set -euo pipefail
umask 077
api_token=$(curl --fail --silent --show-error "$CAPROVER_URL/api/v2/login" \
  -H 'x-namespace: captain' -H 'content-type: application/json' \
  --data "$(jq -n --arg password "$CAPROVER_PASSWORD" '{password:$password}')" | jq -er '.data.token')
download_token=$(curl --fail --silent --show-error "$CAPROVER_URL/api/v2/user/system/createbackup" \
  -H "x-captain-auth: $api_token" -H 'x-namespace: captain' \
  --data '{"postDownloadFileName":"backup.tar"}' | jq -er '.data.downloadToken')
curl --fail --silent --show-error -G "$CAPROVER_URL/api/v2/downloads/" \
  --data-urlencode 'namespace=captain' --data-urlencode "downloadToken=$download_token" \
  -o backup.tar
test -s backup.tar
```

- 将备份文件按日期存入服务器外部的存储，按需加密，并设置保留策略和失败告警。
- 下载 token 有有效期，因此应在同一次任务执行中完成下载。
- 另外安排数据库与数据卷备份，并定期验证恢复流程。

<span id="source-reference-backup-contents"></span>

## 备份文件内容

[备份实现](https://github.com/caprover/caprover/blob/master/src/user/system/BackupManager.ts)会归档 `/captain/data`，并添加 `meta/backup.json`，其中包含 CapRover salt 和集群节点元数据。

| 包含 | 不包含（除非位于 `/captain/data` 内） |
| --- | --- |
| CapRover 配置、应用定义、证书，以及 `/captain/data/registry` 中的自托管 registry 数据。 | 其他位置的 Docker 数据卷、bind mount、数据库文件和本地 Docker 镜像存储。 |

- registry 中的镜像可能导致备份文件很大。
- 初次安装时，恢复程序会查找 `/captain/backup.tar`，并将内容解压到 `/captain/restoring`。
- 完整恢复流程参阅[备份内容](index.md)与[恢复服务器](restore.md)。
