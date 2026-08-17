---
id: stateless-with-persistent-data
title: 无状态应用与持久化数据
sidebar_label: 无状态应用与持久化数据
---


**开始之前，请先阅读：**

* [持久化应用](persistent-apps.md)


本文档帮助你设置一个带持久化数据的无状态应用。例如，用 “**php:7.4-apache**” 托管的网站，把 “**uploads**”（`/var/www/html/uploads`）文件夹或你定义的任何其他文件夹，从 AWS、Wasabi S3 或 [rclone 支持的其他存储系统](https://rclone.org/overview/)提供出去。这让一个原本固定在节点 X 上的应用，可以故障转移到同一个 Docker swarm 中的其他节点。

有多个 docker volume 插件可以支持这种设置。我 [@Daniël](https://caprover.slack.com/archives/DLR2Q4TC1) 和同事 Floris 最初使用 “**rexray/s3fs**”，后来改用 “**sapk/plugin-rclone**”，因为它更稳定，并且能更好地处理从节点 X 到 Y 的故障转移。

---

**重要说明：** 下面的步骤面向中级和高级（*linux*）用户。

---

#### 占位变量

* `$volumename` 例如可以是 `captain--yourappname-rclone`
* `$remotename` 例如可以是 `captain--yourappname`
* `$remotename/path` 例如可以是 `captain--yourappname/_data`
* `$rcloneremotename` 例如可以是 `wasabi-s3`

---

### 1) 准备 rclone

首先创建 `rclone.conf` 文件，这可以在任何已安装 rclone 的（*本地*）机器上完成。
为了简化本文档，我们假设你已经在 Docker swarm 的主节点上[安装了 rclone](https://rclone.org/install/)。

在这个主节点上运行 “**[rclone config](https://rclone.org/commands/rclone_config/)**” 来创建配置文件，完成后运行 `rclone config file` 以了解配置文件的存储位置。
如果你使用 'root' 用户，它会保存在 `/root/.config/rclone/rclone.conf`，我们会把这个路径作为本指南后续内容的参考。

`rclone.conf` 文件看起来会像这样：

```
[$rcloneremotename]
type = s3
provider = Wasabi
access_key_id = YourAccessKey
secret_access_key = YourSecretAccessKey
region = eu-central-1
endpoint = s3.eu-central-1.wasabisys.com
env_auth = false
upload_cutoff = 25M
chunk_size = 5M
disable_checksum = false
upload_concurrency = 3
```

确保每个 swarm 节点都有 `/root/.config/rclone/rclone.conf` 文件，并且内容完全相同。用 `md5sum /root/.config/rclone/rclone.conf` 比较校验和来再次确认。
*或者至少确保，如果有多个配置可用，你将使用的那个是相同的*

### 2) 准备存储系统

确保你的 S3 bucket（或你通过 `rclone config` 配置的存储系统上要使用的文件夹）确实存在，并且 bucket / 文件夹名称与 `$remotename` 的名称匹配。

### 3) 准备 docker rclone 插件

在每个 swarm 节点上，使用这条命令安装 docker volume 插件：`docker plugin install sapk/plugin-rclone`

然后在每个节点上执行这条命令。下面这条是专门为 “**php:N.N-apache**” 容器准备的（_例如 php:7.4-apache_）

```
docker volume create --driver sapk/plugin-rclone --opt config="$(base64 /root/.config/rclone/rclone.conf)" --opt args="--uid 33 --gid 33 --allow-root --allow-other" --opt remote=$rcloneremotename:$remotename/path --name $volumename
```

如果你有一个 S3 bucket，文件通过 AWS / Wasabi Web 界面或其他方式（例如挂载到 S3 bucket 的 SFTPGo）上传，那么你需要告诉 rclone 刷新它的目录缓存：

```
docker volume create --driver sapk/plugin-rclone --opt config="$(base64 /root/.config/rclone/rclone.conf)" --opt args="--uid 33 --gid 33 --allow-root --allow-other --dir-cache-time 5s" --opt remote=$rcloneremotename:$remotename/path --name $volumename
```

实际发生的事情是，“**[rclone mount](https://rclone.org/commands/rclone_mount/)**” 会在 Docker swarm 节点上挂载这个卷。不过要注意，其他标志/参数可能改善或负面影响应用体验，因此要充分测试它们。

**上面的 UID 和 GID 是匹配 Apache2 的，其他应用可能不同。**

### 4) 准备应用

然后部署一个空白应用，不要勾选 “**Has Persistent Data**”，并在 “**HTTP Settings**”、“**App Configs**” 和 “**Deployment**” 标签下按你的喜好设置参数。

在 “**App Configs**” 的 “**Service Update Override**” 部分放入下面的内容。
注意 `/var/www/html/uploads` 是你应自己定义的路径 / 文件夹，这里只作为参考。

根据应用需要，把 “**ReadOnly**” 值设为 `true` 或 `false`。
如果你的 php 应用允许用户上传文件，把它设为 `false`。

```
TaskTemplate:
  ContainerSpec:
    Mounts: [
      {
        "Type": "volume",
        "Source": "$volumename",
        "Target": "/var/www/html/uploads",
        "ReadOnly": false
      }
    ]
```

这样，运行在 “*php:7.4-apache*” 上的应用就可以从 node1 移动到任何正确配置的其他节点。

如果你有问题，或遇到故障，请通过 Slack 的 General 频道联系。如果需要，可以提到我 [@Daniël](https://caprover.slack.com/archives/DLR2Q4TC1)，我会或其他人尽量帮你。
