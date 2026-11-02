---
id: cli
title: 使用 CLI 部署
slug: /deployments/cli
---

- 在开发电脑上运行 `npm install -g caprover` 安装 CapRover CLI。
- 先配置服务器，在 dashboard 创建应用，然后通过 dashboard 的 HTTPS URL 登录：

```bash
caprover login
```

在 Git 项目根目录添加 `captain-definition` 文件。例如，使用仓库中的 Dockerfile：

```json
{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}
```

- 在项目目录运行 `caprover deploy`，根据提示选择已保存的服务器、应用和分支。
- CLI 会上传已经提交到 Git 的内容，启动构建并显示进度。
- 未提交的文件和被 Git 忽略的文件不会上传。
- 首次部署成功后，在同一目录运行 `caprover deploy -d` 可以复用上次保存的选项。

- 如果已有预构建镜像，使用 `caprover deploy --imageName IMAGE`，并在提示时指定应用和服务器。
- 不要让凭据出现在 shell 历史或 CI 日志中；单应用自动部署更适合使用[部署 token](ci-cd/index.md)。
- 完整参数请参阅 [CLI 命令参考](../reference/cli.md)。
