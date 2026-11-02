---
id: index
title: 备份并恢复 CapRover
slug: /server/backup
---

<span id="source-server-backup-contents"></span>

## 什么是备份

一个 CapRover 备份副本 **`/captain/data`** 并添加关于集群节点的元数据。 这包括CapRover配置和状态,如app定义,域设置,以及存储在那里的证书.

- 没错 **没有** 自动包括Docker卷,主机绑定挂载在该目录外,存储在这些位置的数据库内容,上传到那里的文件,或者本地构建的Docker镜像.
- 使用自己的一致导出或快照进程备份每个数据库,并复制您实际使用的持久目录 。
- 测试 CapRover 归档和应用数据都可以恢复.

- 镜像规则的一个例外是 **自托管 registry**: 其存储的镜像数据位于 `/captain/data/registry`,因此该目录被复制,并可能大大增加归档大小。
- 设有外部registry,保留其证书和镜像保存政策,以供恢复。
- 没有可访问的镜像,在恢复其定义后重新部署应用.

见 [创建备份](index.md), [恢复服务器](restore.md),以及 [持久化目录](../../data-persistence/index.md).

<span id="source-server-backup-create"></span>

## 创建备份

1. 在CapRoverdashboard,去 **设置** 选择 **创建备份**.
2. 下载结果 `.tar` 文件, 校验它是非空的, 并将其保存在服务器外, 有访问控制 。
3. 分别备份应用程序数据库和持久化目录; [CapRover 存档范围有限](index.md).
4. 定期恢复两种备份到测试服务器,并验证应用程序.

- 存档在服务器上生成,然后作为临时下载提供.
- 保留自己的副本:生成的下载是临时的.
- 如果启用了自托管 registry,则允许其镜像数据在归档中留有空间.

<span id="source-server-backup-automate"></span>

## 自动备份

- dashboard **创建备份** 动作有相应的认证 API 端点。
- 以下例子需要: `curl` 和 `jq`.
- 设定 `CAPROVER_URL` HTTPS dashboard来源 `CAPROVER_PASSWORD` 安全地通过你的日程安排员的秘密商店。

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

- 将文件移动到日期外服务器存储,酌情加密,并设置保存和故障提示.
- 下载符是临时的;在同一运行中完成下载.
- 安排单独的数据库和音量备份,并定期测试修复.

<span id="source-reference-backup-contents"></span>

## 备份内容

这个 [备份执行](https://github.com/caprover/caprover/blob/master/src/user/system/BackupManager.ts) 档案 `/captain/data` 添加 `meta/backup.json` 与 CapRover 盐和集群节点元数据。

| 包含 | 排除, 除非存储在内 `/captain/data` |
| --- | --- |
| 保存 CapRover 配置、 应用程序定义、 证书和自托管 registry数据 `/captain/data/registry`. | Docker卷和主机绑定在别处挂载,那里有数据库文件,以及当地的Docker镜像商店. |

- 注册例外可使档案量大。
- 恢复代码寻找 `/captain/backup.tar` 在初始安装时将其扩展为 `/captain/restoring`.
- 见 [什么是备份](index.md) 和 [恢复服务器](restore.md) 完全恢复序列。
