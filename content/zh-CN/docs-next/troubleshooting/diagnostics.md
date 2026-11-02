---
id: diagnostics
title: 收集诊断信息
slug: /troubleshooting/diagnostics
---

## 快速检查

先记录时间、操作、受影响的应用或域名、预期结果、实际结果以及错误信息。

在 **Swarm manager** 节点运行：

```bash
docker service ls
docker service ps captain-captain --no-trunc
docker service logs captain-captain --tail 100
```

**根据故障类型检查：**

- **应用：**通过 `docker service ls` 查找 service。旧版应用可能使用 `srv-captain--APP_NAME` 名称。继续执行 `docker service ps SERVICE_NAME` 和 `docker service logs SERVICE_NAME`。
- **网络：**检查 DNS，并分别测试 HTTP 与 HTTPS。
- **存储：**检查挂载、磁盘空间和任务所在节点。

## 收集完整服务器报告 {#collect-a-full-server-report}

如果 dashboard 无法访问、多个服务发生故障或快速检查没有明确结果，可以运行[诊断收集脚本](https://github.com/caprover/caprover-website/blob/master/scripts/caprover-diagnostic.sh)。在使用 systemd 的 Debian/Ubuntu **Swarm manager** 上执行：

```bash
curl -fL https://raw.githubusercontent.com/caprover/caprover-website/master/scripts/caprover-diagnostic.sh -o caprover-diagnostic.sh
less caprover-diagnostic.sh
sudo sh ./caprover-diagnostic.sh
```

**输出文件：**`/tmp/caprover-diagnostic.*.txt`，仅文件所有者可访问。

**检查项目包括：**

- 80/443/3000 端口的占用进程、宿主机 Web 服务和本地 HTTP 响应。
- Docker/Swarm service、任务错误、配置和日志。
- `/captain` 挂载及权限、网络、防火墙、内核及 Docker daemon 错误。
- 软件包安装历史和可用的容器 runtime。

脚本会尝试短暂运行本地 `hello-world` 和 `nginx:1.27.2` 镜像，**前提是镜像已经存在**。它不会拉取镜像，也不会修改 CapRover service 配置。

**先阅读报告摘要。**例如：

- **80/443 端口已被其他进程占用：**可能导致 CapRover NGINX 无法绑定端口。
- **Swarm 任务被拒绝：**查看任务错误原因。
- **`/captain` 挂载缺失：**检查宿主机路径和挂载状态。
- **Docker API 警告：**结合其他证据判断。在 [issue #2377](https://github.com/caprover/caprover/issues/2377) 中，原因是宿主机 NGINX 占用了 80 端口。

## 分享报告前

- 检查整个报告并清除密码、token、用户隐私数据、应用名称以及能够识别服务器的信息。
- 诊断脚本不会收集 Docker 环境变量和 CapRover 配置正文，但日志、命令参数和软件包历史仍可能包含敏感信息。
- 仅分享经过脱敏且与问题有关的部分。

针对性恢复步骤参阅[服务器诊断](diagnostics.md)。

<span id="source-server-diagnostics"></span>

## 重启或检查服务

```bash
docker service update captain-captain --force   # Restart CapRover
docker service update SERVICE_NAME --force      # Restart an app
docker service logs SERVICE_NAME --since 10m
```

请在 Swarm manager 节点执行 Docker 命令。通过 `docker service ls` 获取实际 service 名称。如果需要进入应用容器，应在运行该任务的节点上执行 `docker exec`（见下文）。

## 故障诊断

从失败的请求或应用入手，记录时间和准确的错误信息。在 dashboard 中查看应用部署历史和日志。在 manager 节点运行：

```bash
docker service ls
docker service ps captain-captain --no-trunc
docker service logs captain-captain --tail 100
docker system df
```

- 通过 `docker service ls` 找到应用 service，再运行 `docker service ps SERVICE_NAME --no-trunc` 和 `docker service logs SERVICE_NAME --tail 100`。
- 新版应用通常以应用名作为 service 名称；旧版应用可能使用 `srv-captain--APP_NAME`。
- 对 DNS 或 HTTPS 问题，检查解析记录、端口可达性和域名证书状态。
- 多节点故障应检查节点可用性和私有网络连接。
- 分享日志前删除密码、token 和其他敏感数据。
- 更多按症状分类的指南参阅[故障排查](index.md)。

如果多个系统服务同时故障，或宿主机问题不明确，请在 manager 上[收集完整报告](diagnostics.md#collect-a-full-server-report)。

### 无法通过 3000 端口访问 dashboard

- 在 manager 上执行 `docker service ps captain-captain --no-trunc`，再查看 `docker service logs captain-captain --since 60m` 和 `docker service logs captain-nginx --since 60m`。
- 在 manager 上测试 `curl -v http://127.0.0.1:3000/`。
- 如果本地请求成功但公网 IP 无法访问，请检查云服务商和宿主机防火墙，以及端口映射。
- 如果 CapRover service 一直重启，先查看任务错误和日志，再调整网络。
- 修复根因后，可执行 `docker service update captain-captain --force` 强制重启。

### 重启或检查应用

- 在 dashboard 中保存应用配置，可以触发 service update。
- 如果需要进入运行中的容器，先通过 `docker service ls` 找到 service 名称，再用 `docker service ps SERVICE_NAME` 确认所在节点，然后在**该节点**运行：

```bash
docker ps --filter label=com.docker.swarm.service.name=SERVICE_NAME
docker exec -it CONTAINER_ID /bin/sh
```

将 `SERVICE_NAME` 和 `CONTAINER_ID` 替换为实际值。部分镜像没有 `/bin/bash`，但通常包含 `/bin/sh`。容器 shell 可能访问应用数据和 secrets，请谨慎使用。
