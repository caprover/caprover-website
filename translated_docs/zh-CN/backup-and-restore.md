---
id: backup-and-restore
title: 备份与恢复
sidebar_label: 备份与恢复
---

### 备份与恢复

_这个功能在 v1.3.0 中加入。_

_备份/恢复功能仍处于实验阶段。未来还会有更多变更。_

备份/恢复是一个复杂过程，需要理解 CapRover 实例中不同组件如何工作。如果你计划使用这个功能，请务必完整阅读本文档，并先在测试服务器上练习、熟悉流程，然后再在生产环境中使用。

**简要结论：** 常规备份/恢复适用于除镜像和卷之外的所有内容。对于镜像，你必须使用 Docker Registry（有优点也有缺点）；对于卷，你必须使用自定义方案（有优点也有缺点）。

### 备份过程

在正在运行的 CapRover 实例上，打开 Web 控制台，进入 settings 页面，点击 “Create Backup” 按钮。几秒钟后下载会开始。保留这个 tar 文件，恢复 CapRover 实例时会用到它。

#### 自动化备份过程

你可以创建一个简单的 bash 脚本做自动备份：

```bash
    API_TOKEN=$(curl $CAPROVER_URL/api/v2/login \
        -H 'x-namespace: captain' \
        -H 'content-type: application/json;charset=UTF-8' \
        --data-raw "{\"password\":\"$CAPROVER_PASSWORD\"}" \
        --compressed --silent | jq -r ".data.token")

    DOWNLOAD_TOKEN=$(curl $CAPROVER_URL/api/v2/user/system/createbackup \
        -H "x-captain-auth: $API_TOKEN" \
        -H 'x-namespace: captain' \
        --data-raw '{"postDownloadFileName":"backup.tar"}' \
        --compressed --silent | jq -r ".data.downloadToken")

    if [ ${#DOWNLOAD_TOKEN} -le 10 ]; then
        echo "DOWNLOAD_TOKEN must be at least 10 char long"
        exit 1
    fi

    wget "$CAPROVER_URL/api/v2/downloads/?namespace=captain&downloadToken=$DOWNLOAD_TOKEN" -O backup.tar
```

### 恢复过程

这个过程和全新安装 CapRover 非常相似，只有几点不同。按照 [开始使用](get-started.md) 中的前置条件步骤操作，并确保服务器上已安装 Docker。

**不要**运行安装命令 `docker run -p 80:80 -p 443:443.....`。改为执行下面的步骤：

_（在下面的说明中，把 123.123.123.123 替换成你的服务器 IP）_

1. 通过运行 <br/> `ssh root@123.123.123.123 mkdir /captain` 在服务器上创建一个空的 `/captain` 目录
2. 在桌面上把目标备份文件重命名为 `backup.tar`。
3. 把 `backup.tar` 复制到服务器： <br/> `scp ./backup.tar root@123.123.123.123:/captain/`
4. 安装 CapRover：

```bash
docker run -p 80:80 -p 443:443 -p 3000:3000 -e ACCEPTED_TERMS=true -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

CapRover 会自动检测你的 `backup.tar`，解压它，并恢复所有配置和设置。

5. 你需要配置 DNS，使 `*.youroldroot.domain.com` 指向新服务器 IP。

### 保留旧服务器

有些情况下，你仍然让前一台服务器运行，只是想创建服务器的一个克隆。因为你希望旧服务器继续运行，所以不应更改旧域名的 DNS。你应分配一个新域名。这时：

1. 在 DNS 中创建一条新的通配符条目 `*.yournewroot.domain.com`，并指向新服务器
2. 在桌面机器上，在 `etc/hosts` 文件中创建一条临时条目，并加入这一行

```
NEW-SERVER-IP-ADDRESS   captain.oldroot.domain.com
```

注意你不能在 hosts 文件中使用通配符，只需加入控制台域名，以便临时访问它。

3. 在浏览器中打开 `captain.oldroot.domain.com` 并登录控制台。

注意你可能会看到 SSL 错误，可以点击 advance 并忽略。这没问题，因为 SSL 证书可能已经过期。等你设置好一切并重启 CapRover 后，它会续期。

4. 登录控制台后，把根域名改成 `yournewroot.domain.com`。

5. 如果需要，重新为控制台和其他应用启用 SSL 证书并 Force HTTPS。

6. 编辑 `etc/hosts`，删除你在第 2 步加入的那一行。

### 恢复了什么？

CapRover 备份过程会备份 `/captain/data/` 目录中的所有内容。这包括应用设置、配置、SSL 证书等。它不包含：**容器镜像**和**持久化目录**

1. **容器镜像：** 恢复 CapRover 实例后，你会发现应用配置已设置好，但所有应用都回到了默认状态 “Your App Will Be Here!”。你需要重新部署所有应用。这种方法的好处是 `backup.tar` 文件很小、容易管理。缺点当然是必须为所有应用重新部署。如果你真的希望镜像也保存在备份中，需要使用 [Docker Registry](#d-r)。
2. **持久化目录：** 一些应用（例如数据库）有持久化目录。因为每个数据库都有自己的备份机制，建议为特定数据库使用合适的备份方法，例如 MongoDB 的 `mongodump` 或 MySQL 的 `mysqldump` 等。这是数据库的最佳方法，因为它不会导致停机。另一种方法是创建卷快照。这种方法更通用，几乎适用于所有内容。例如，你可以使用这个[第三方项目](https://github.com/loomchild/volume-backup)。不过，在运行它之前，为了避免数据损坏，需要确保容器已停止 `docker service ls --format {{.Name}} | while read in; do docker service scale "$in"=0; done`，然后拍快照，再恢复所有服务 `docker service ls --format {{.Name}} | while read in; do docker service scale "$in"=1; done`。在不久的将来，CapRover 会内置类似方案。
   其他用于备份持久化目录的有用工具包括：

- https://github.com/futurice/docker-volume-backup
- https://github.com/loomchild/volume-backup
- https://github.com/blacklabelops/volumerize
- https://github.com/schickling/dockerfiles/tree/master/postgres-backup-s3
- https://github.com/schickling/dockerfiles/tree/master/mysql-backup-s3

<details>
  <summary>Docker Registry</summary>


### Docker Registry 说明

如上所述，容器镜像不是备份的一部分。为了确保恢复后应用不需要重新部署，你需要确保正在使用 Docker Registry。Docker Registry 是保存应用镜像的地方。

#### 第三方 Registry

如果你在 CapRover 控制台的 Cluster 部分设置了 “default push registry”，每个镜像在服务器上构建完成后都会被推送到该 registry。这是最好的选项，因为它是一个独立实体，你不需要自己保管镜像。恢复 CapRover 实例后，一切都会正常工作。

#### 自托管 Registry

如果你把 “default push registry” 设为 CapRover 自托管 registry，恢复后应用开箱即可工作。不过缺点是 `backup.tar` 会非常大。这个文件会包含服务器上构建的所有镜像。

如果你以前设置过自托管 registry，后来改变主意，禁用了自托管 registry 并改用第三方 registry，备份文件仍然会很大，因为文件还在主机系统上。如果你想清除 registry 中存储的所有镜像，删除 registry 目录 `rm -rf /captain/data/registry`

</details>

<details>
  <summary>多节点设置</summary>


### 多节点

当你有集群时会怎样？备份和恢复过程与单节点几乎相同，只是在恢复期间，第一次运行会在检测到你正在恢复集群后退出。系统会要求你编辑一个文件并加入新节点的 IP 地址。

例如，以前你有 2 个节点：

- 222.222.222.10（主节点）
- 222.222.222.11

恢复时你准备了 2 个节点：

- 222.222.222.20（主节点）
- 222.222.222.21

你在 `222.222.222.20` 上运行恢复脚本，脚本退出并要求你输入第二个节点的信息。你编辑恢复说明文件，把旧 IP `222.222.222.11` 的新 IP 设为 `222.222.222.21`。

接下来，你需要把私钥（通常名为 `id_rsa`）复制到服务器。例如，在 linux 上：

```bash
scp /home/myuser/.ssh/id_rsa root@123.123.123.123:/captain/
```

_恢复过程完成后，确保从服务器删除这个文件_

现在重新运行恢复脚本（就是刚才退出并要求更多信息的那个）。这次过程会继续，节点会被恢复，应用也会调整到新节点。例如，如果以前有一个持久化应用锁定在第二个节点上，在恢复后的实例中它也会锁定到第二个节点。

集群的卷恢复更复杂一些。但如果你在使用集群，你大概知道自己在做什么。

</details>
