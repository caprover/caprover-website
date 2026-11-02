---
id: git
title: 从基特部署
slug: /deployments/git
---

## 设置

1. 添加一个 `captain-definition` 文档到您的仓库。
2. 创建 CapRover 应用程序 。
3. 在其部署设置中,输入寄存器 URL,分支,和证书.
4. 保存并复制生成的 Webhook URL 。
5. 添加该 URL为 **推动网点** 在你的Git供应商。
6. 发泄一个承诺。 检查CapRover部署记录

**私人仓库:** 使用只读部署密钥或有限服务账户.

**重要内容 :**

- 一个webhook推让CapRover获取配置的分支并构建应用程序.
- 将 Webhook URL 视为一个秘密 。
- 仓库 URL 格式、 SSH 密钥和 Webhook 屏幕取决于您的服务商 。
- 对于离服务器更远的可复制构件,请使用 [排雷中心/CD](ci-cd/index.md) 以部署镜像。
