---
id: upgrade
title: 升级 CapRover
slug: /server/upgrade
---

在 dashboard 中打开 **Settings**，有可用的稳定版更新时，使用内置升级功能。

在 Swarm manager 节点上执行以下命令。

<span id="测试-edge-镜像"></span>

## 切换到 edge

```bash
docker pull caprover/caprover-edge:latest
docker service update captain-captain --image caprover/caprover-edge:latest
```

## 切回稳定版

```bash
docker service update captain-captain --image caprover/caprover:latest
```

如果 edge 版本引入了与稳定版不兼容的改动，切回稳定版可能会失败。

如果升级失败，请参阅[诊断指南](../troubleshooting/diagnostics.md)。
