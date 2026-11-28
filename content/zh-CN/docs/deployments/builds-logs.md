---
id: builds-logs
title: 构建与构建日志
slug: /deployments/builds-logs
---

- 除非提供预构建镜像，否则 CapRover 会在服务器上从源码构建镜像。
- 如果构建失败，先在部署输出中找到第一个报错的命令。
- 常见原因包括缺少文件、Dockerfile 配置错误、依赖下载失败，以及内存或磁盘空间不足。

- 镜像构建完成后，Docker 会更新应用对应的 service。
- 如果容器退出、健康检查失败或返回 502，需要另外查看 Docker service 和应用日志。
- 应用设置中的容器 HTTP 端口必须与进程实际监听的端口一致。

- 对资源需求较大的构建，建议在 CI 中构建并推送镜像，再让 CapRover 部署该镜像。
- 如果部署卡住，请先收集失败的 build log、service 状态及近期应用日志，再按照[部署故障排查](../troubleshooting/index.md)检查。

<span id="source-deployments-versions-rollback"></span>

## 版本与回滚

在应用的 **Deployment** 标签页中打开 **Version History**，在目标镜像所在行点击 **Revert to this version**，然后确认。

- 回滚镜像**不会**恢复旧的环境变量、域名、数据卷内容或数据库 Schema。
- 如果新版本修改了持久化数据，回滚前应确认旧镜像仍然兼容这些数据。
- 保留足够的镜像历史，或保证 registry 中仍可获取需要回滚的版本。

滚动部署期间的请求行为受到健康检查和更新策略影响。可参阅[健康检查与零停机部署](../scaling/index.md)规划可用性。
