# 简体中文技术术语表

本表用于统一文档站与营销站的用词。调整术语时请同步更新本文件。

| Source term | Preferred Chinese usage |
| --- | --- |
| app / application | 应用 |
| backup | 备份 |
| build | 构建 |
| certificate | 证书 |
| cluster | 集群 |
| container | 容器 |
| dashboard | 控制面板 |
| deploy / deployment | 部署 |
| domain / root domain / subdomain | 域名 / 根域名 / 子域名 |
| downtime / zero downtime | 停机 / 零停机 |
| email | 邮件 |
| environment variable | 环境变量 |
| image | 镜像 |
| instance | 实例 |
| node | 节点 |
| one-click app | 一键应用 |
| override | 覆盖配置 |
| persistent directory | 持久化目录 |
| port mapping | 端口映射 |
| provider | 服务商 |
| registry | registry |
| reverse proxy | 反向代理 |
| rollback | 回滚 |
| self-hosted | 自托管 |
| service | 服务 |
| volume | 卷 |
| wildcard DNS | 通配符 DNS |

保持产品、项目和公司名称原样，包括 CapRover、Docker、Docker Swarm、nginx/NGINX、GitHub、GitLab、DigitalOcean、Coolify、Dokploy、Dokku、Let's Encrypt 和 Play-with-Docker。

命令、参数、环境变量、配置键值、文件路径、镜像名、标签和标识符一律保持原样；`captain-definition` 等专有文件名不翻译。

界面标签沿用产品当前实际显示的语言。CapRover 控制面板尚未本地化时，保留 "Deployment"、"Enable App Token"、"Container Port" 等英文标签。

在目标语言里工程师习惯使用英文的术语（例如 registry、Dockerfile），保留英文比强行翻译更自然。同一个术语在同一页面内必须保持一致。

## 技术术语补充

- 保留 **Docker Swarm**、**Swarm manager**（manager 节点）、**worker node**（worker 节点）。Swarm 绝不能译为「沼泽」。
- **Captain Definition** 是 CapRover 部署描述文件的名称，保留英文，不译为「船长定义」。
- **Docker image** = Docker 镜像；**registry** = registry / 镜像仓库；**push/pull** = 推送/拉取镜像。
- **build** = 构建；**deployment** = 部署；**rollback** = 回滚；**volume** = 数据卷；**bind mount** = 绑定挂载。
- **container** = 容器，**port** = 端口，**host** = 主机。避免「集装箱」「港口」「多克」「建筑」「书记官处」等字面误译。
- 用户界面中 **Container HTTP Port**、**Deployment**、**Service Update Override** 等尚未本地化的标签使用英文原名。
- 保留所有命令、镜像名、端口、路径、环境变量、密钥占位符和警告的技术含义。
