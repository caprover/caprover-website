---
id: upgrade
title: 升级 CapRover
slug: /server/upgrade
---

在 dashboard 中打开 **Maintenance → CapRover Updates**。有可用的稳定版更新时，点击 **Install Update**。旧版 dashboard 的更新入口位于 **Settings**。

在 Swarm manager 节点上执行以下命令。

<span id="docker-api-compatibility"></span>

## Docker API 要求

如果 dashboard 因主机的 Docker API 版本过旧而阻止升级，请先升级 Docker Engine，再从 dashboard 重试。如果已设置 `dockerApiVersion`，请在升级 Docker Engine 前确认新版本支持该设置指定的 API 版本。

dashboard 会将主机支持的最高 Docker API 版本与目标版本的要求进行比较。`dockerApiVersion` 仅用于指定 Captain 自身调用 Docker 时使用的 API 版本。CapRover 的开发和测试使用默认 API 版本。较低的 API 版本能完成某次升级，并不能保证后续升级也能成功。

### 指定 API 版本时手动升级

仅当当前 CapRover 安装已使用自定义 `dockerApiVersion` 正常运行时，才按以下步骤操作。直接更新 `captain-captain` 服务会绕过 CapRover 的兼容性检查。Captain 可能无法启动，导致 dashboard 不可用，也可能在启动后出现应用部署等操作失败的情况。请自行承担风险，并做好验证升级和恢复服务器的准备。

1. [备份 CapRover 和应用数据](backup/index.md)。通过 SSH 连接到 Swarm manager 节点，记录当前镜像的完整引用。如果包含镜像摘要，也请一并记录。

   ```bash
   docker service inspect --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' captain-captain
   ```

2. 将 `TARGET_VERSION` 替换为确切的 CapRover 版本标签，然后更新服务。

   ```bash
   docker service update --image caprover/caprover:TARGET_VERSION captain-captain
   ```

3. 在 dashboard 中确认版本，并检查应用能否访问和部署。
4. 如果升级失败且旧版本仍能读取当前数据，请将 `PREVIOUS_IMAGE` 替换为先前记录的完整镜像引用，再部署该镜像。如果升级对数据做了不兼容的更改，请[在新服务器上恢复升级前的备份](backup/restore.md)。将恢复指南中 `docker run` 命令的 `caprover/caprover` 替换为先前记录的完整镜像引用。

   ```bash
   docker service update --image PREVIOUS_IMAGE captain-captain
   ```

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
