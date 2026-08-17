---
id: cdd-migration
title: CaptainDuckDuck 升级
sidebar_label: CaptainDuckDuck 升级
---

注意：这一节只适用于把 CaptainDuckDuck 服务器升级到 CapRover。

### 迁移脚本

运行[这个脚本](https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/migrate-from-cdd.sh)，即可把 CaptainDuckDuck 服务器升级到 CapRover。它会自动备份配置目录 `/captain`，以便出现问题时恢复。


要迁移，运行下面几行即可：

```bash
wget https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/migrate-from-cdd.sh

chmod +x migrate-from-cdd.sh

./migrate-from-cdd.sh
```


### 迁移提示：

确保有足够的磁盘空间。CapRover 镜像大约 400MB，脚本还会自动备份配置目录。

#### 没有自托管 Registry
如果你大约有 1.5GB 可用空间，通常没有问题。

#### 有自托管 Registry
自托管 Registry 可能占用很多 GB 磁盘空间。由于迁移脚本会自动备份配置目录，升级时可能出现问题。

为了节省空间，如果你启用了自托管 Registry，有两个选择：
- 可以手动编辑迁移脚本，删除备份那一行（`tar -cvf /captain-bk-$(date +%Y_%m_%d_%H_%M_%S).tar /captain`），
- 或者运行 `rm -rf /captain/registry/*` 删除 registry 中的全部内容，因为它会占用大量磁盘空间。注意，如果你执行这个操作，必须重新部署应用，其他节点才能访问它。如果你只有一个节点，则不需要额外操作。


### 从 CaptainDuckDuck 到 CapRover 的破坏性变更：
- captain-definition 文件的 `schemaVersion` 改为 `2`。
- 如果你以前必须把某个应用的自定义端口改成非 80 端口，现在不再需要编辑 NGINX 配置，只需在 UI 中把容器端口设为任意端口。
- 如果你以前使用了自定义 dockerfileLines，所有 `ADD` 和 `COPY` 语句都加了 `./src` 前缀。在 CapRover 中这不再需要。例如，你以前写的是
```bash
COPY ./src/package.json /usr/app/
```

在 CapRover 中应改为

```bash
COPY ./package.json /usr/app/
```
