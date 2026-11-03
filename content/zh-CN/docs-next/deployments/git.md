---
id: git
title: 从 Git 部署
slug: /deployments/git
---

## 配置流程

1. 在代码仓库中添加 `captain-definition` 文件。
2. 在 CapRover 中创建应用。
3. 在应用部署设置中填写仓库 URL、分支和访问凭据。
4. 保存设置，并复制自动生成的 webhook URL。
5. 在 Git 托管服务中将该 URL 配置为 **push webhook**。
6. 推送一次 commit，并查看 CapRover 部署日志。

**私有仓库：**使用只读 SSH deploy key 或权限受限的服务账号。如果使用 SSH，请运行 `ssh-keygen -t ed25519 -f ./deploykey -N ""` 生成专用密钥。将 `deploykey.pub` 添加到仓库的 deploy keys，并在 CapRover 中填写 SSH 克隆 URL 和 `deploykey` 的内容。

**GitHub webhook：**选择 `application/json` 和 push 事件，将 GitHub 单独的 **Secret** 字段留空。

**注意：**

- 接收到 push webhook 后，CapRover 会拉取配置的分支并构建应用。
- Webhook URL 应视为敏感凭据。
- 仓库 URL 格式、SSH key 和 webhook 配置界面因 Git 服务商而异。
- 如果希望构建过程可复现且不占用服务器资源，可以通过 [CI/CD](ci-cd/index.md) 构建并部署镜像。
