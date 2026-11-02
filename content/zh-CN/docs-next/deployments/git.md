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

**私有仓库：**建议使用只读 deploy key，或权限受限的 service account。

**注意：**

- 接收到 push webhook 后，CapRover 会拉取配置的分支并构建应用。
- Webhook URL 应视为敏感凭据。
- 仓库 URL 格式、SSH key 和 webhook 配置界面因 Git 服务商而异。
- 如果希望构建过程可复现且不占用服务器资源，可以通过 [CI/CD](ci-cd/index.md) 构建并部署镜像。
