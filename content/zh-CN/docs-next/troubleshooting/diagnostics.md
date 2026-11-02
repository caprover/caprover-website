---
id: diagnostics
title: 收集诊断
slug: /troubleshooting/diagnostics
---

## 快速检查

抓取:时间,操作,受影响的app/域,预期结果,实际结果,以及错误.

打开 **沼泽管理器**:

```bash
docker service ls
docker service ps captain-captain --no-trunc
docker service logs captain-captain --tail 100
```

**检查症状:**

- **应用 :** 在 `docker service ls`。老应用程序可能使用 `srv-captain--APP_NAME`组合 `docker service ps SERVICE_NAME` 和 `docker service logs SERVICE_NAME`.
- **联网 :** 检查DNS并分别测试HTTP和HTTPS.
- **存储 :** 检查挂载、磁盘空间和节点位置 。

## 收集完整的服务器报告 {#collect-a-full-server-report}

使用 [诊断收集器](https://github.com/caprover/caprover-website/blob/master/scripts/caprover-diagnostic.sh) 如果没有仪表板,若干服务失败,或快速检查没有结果。 运行在 Debian/ Ubuntu 上 **沼泽管理器** 已系统化 :

```bash
curl -fL https://raw.githubusercontent.com/caprover/caprover-website/master/scripts/caprover-diagnostic.sh -o caprover-diagnostic.sh
less caprover-diagnostic.sh
sudo sh ./caprover-diagnostic.sh
```

**输出 :** `/tmp/caprover-diagnostic.*.txt`,只有所有者权限。

**检查包括:**

- 端口所有者(80/443/300),主机网络服务器,本地HTTP响应
- Docker/Swarm服务、任务错误、规格和日志
- `/captain` 挂载和权限、网络、防火墙、内核和守护进程错误
- 软件包历史和可用的容器运行时间

收藏家简短测试本地 `hello-world` 和 `nginx:1.27.2` 图像 **如果已经可用**它不拉动图像或改变 CapRover 服务配置。

**首先阅读报告摘要。** 实例:

- **80/443号港口拥有另一个流程:** CapRover NGINX可能无法绑定.
- **拒绝 Swarm 任务 :** 检查它的任务错误 。
- **`/captain` 挂载缺失 :** 检查主机路径和挂载。
- **Docker API 警告 :** 检查其他证据。 内 [问题2377](https://github.com/caprover/caprover/issues/2377),主机NGINX占领端口80.

## 共享前

- 审查整份报告的密码,令牌,私人用户数据,应用程序名称,并识别主机细节.
- 采集器省略了Docker环境变量和CapRover配置内容,但日志,参数和包历史仍然可以包含敏感数据.
- 仅分享相关,消毒的部分.

见 [服务器诊断](diagnostics.md) 目标明确的恢复步骤。

<span id="source-server-diagnostics"></span>

## 恢复服务或检查服务

```bash
docker service update captain-captain --force   # Restart CapRover
docker service update SERVICE_NAME --force      # Restart an app
docker service logs SERVICE_NAME --since 10m
```

运行鼠标管理器上的 Docker 命令 。 获取确切的物理服务名称 `docker service ls`对于应用程序中的外壳,请使用 `docker exec` 任务所在的节点(见下文)。

## 诊断

从失败的请求或应用开始,它的时间戳,以及准确的错误. 在仪表板中,检查应用程序的部署历史和日志. 在管理器主机上 :

```bash
docker service ls
docker service ps captain-captain --no-trunc
docker service logs captain-captain --tail 100
docker system df
```

- 对于应用程序,请在 `docker service ls` 检查 `docker service ps SERVICE_NAME --no-trunc` 和 `docker service logs SERVICE_NAME --tail 100`.
- 更新的应用程序一般使用该应用程序的名称; 遗留的应用程序可能使用 `srv-captain--APP_NAME`.
- 对于DNS或HTTPS故障,检查记录,端口可达性,以及域的证书状态.
- 对于多节点问题,核查节点可用性和私人网络.
- 在共享密码,令牌和私人数据之前从日志中删除.
- 见 [解决问题](index.md) 寻找导师的症状。

对于涉及几个系统服务的停机或主机故障, [收集完整的服务器报告](diagnostics.md#collect-a-full-server-report) 在经理。

### 端口3000号没有挂板

- 在经理,检查 `docker service ps captain-captain --no-trunc`,然后检查 `docker service logs captain-captain --since 60m` 和 `docker service logs captain-nginx --since 60m`.
- 运行 `curl -v http://127.0.0.1:3000/` 在经理。
- 如果本地请求有效但公共IP不起作用,则检查提供者和主机防火墙及端口映射.
- 如果 CapRover 服务正在重新启动, 在更改网络之前使用任务错误和日志 。
- 要在纠正基本问题后强制重启, 请运行 `docker service update captain-captain --force`.

### 重新启动或检查应用程序

- 从仪表板上保存应用程序的配置以请求服务更新.
- 对于运行中的任务中的弹壳,首先从 `docker service ls`,查找主机 `docker service ps SERVICE_NAME`运行这些 **该主机**:

```bash
docker ps --filter label=com.docker.swarm.service.name=SERVICE_NAME
docker exec -it CONTAINER_ID /bin/sh
```

替换 `SERVICE_NAME` 和 `CONTAINER_ID` 你检查的值。 不是每个图像都包含 `/bin/bash`; `/bin/sh` 比较常见。 容器外壳可以广泛访问应用程序的数据和秘密.
