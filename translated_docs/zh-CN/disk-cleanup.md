---
id: disk-cleanup
title: 磁盘清理
sidebar_label: 磁盘清理
---

<br/>

Docker 会以不同方式使用磁盘：

## Docker 镜像
保存镜像：镜像是包含你部署到服务器的已构建源码的压缩文件。每次部署代码的新版本时，Docker 都会为新版本构建一个新镜像，并默认保留旧镜像。如果你想清理服务器上所有 “未使用” 的镜像，运行
```
docker container prune --force
docker image prune --all
```

重要说明：只有在你已经设置了 Docker registry（本地或远程）时，才应使用这种方法。这是因为 Docker 存在一个缺陷，关于问题和相关 [Docker Issue](https://github.com/moby/moby/issues/36295) 的更多细节见[这里](https://github.com/caprover/caprover/issues/180)。

## Docker 卷
卷，也就是 “持久化目录”。当你创建一个带持久化数据的应用（例如数据库）时，会给它分配一个持久化目录。当你更改持久化目录，或删除应用时，这些卷就不再需要了。清理孤立卷比较麻烦。如果某个应用 “当前” 正在崩溃且未运行，但它有一个仍然有用的卷，Docker 也会把它视为 “孤立” 的。因此，要安全清理孤立卷，先检查所有服务是否正在运行：
```
docker service ls
```
在 REPLICAS 下，你应看到 `1/1`、`2/2` 等。如果看到某个服务没有运行，就不要继续。否则，可以继续用下面的命令清理孤立卷：
```
docker volume prune
```

或者，你可以先列出所有卷，然后只删除你不想保留的那些：
```
docker volume ls                          # lists all volumes
docker volume rm volume-name-goes-here    # removes a specific volume
```
