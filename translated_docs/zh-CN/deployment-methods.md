---
id: deployment-methods
title: 部署方式
sidebar_label: 部署方式
---

<br/>
无论使用哪种部署方式，都要确保项目中有 `captain-definition` 文件。更多细节见 [Captain Definition](captain-definition-file.md) 文档。

## 通过 CLI 部署
在 git 仓库中运行 `caprover deploy`，然后按步骤操作。这是最好的方法，因为它是唯一会向你报告潜在构建失败的方法。更多内容见：
 [开始使用 - 第 5 步](get-started.md#step-5-deploy-the-test-app)。

## 通过 Web 控制台部署
把项目内容打包成 tarball（`.tar`），打开 Captain Web 控制台并上传 tar 文件。这种方式通常只用于测试。

对于不需要任何源码的 captain-definition 文件，例如[这个](/docs/captain-definition-file.html#use-image-name)，你可以直接在 Web 控制台复制粘贴 captain-definition 内容。

![deployapp](/img/docs/app-deploy.png)

## 一键回滚

假设你部署了应用的新版本，但发现它有问题。你没有时间回退更改或修复缺陷，该怎么办？很简单。打开部署标签，点击你想回退到的版本旁边的还原图标。CapRover 会自动开始一次新的构建，并部署那个版本。注意，这**不会**回退你对环境变量和其他应用配置（例如持久化目录）的更改。它只回退镜像（已部署的源码）。

## 使用 Github、Bitbucket 等自动部署
这可能是最方便的方法。当你把仓库推送到特定分支（例如 `master`、`staging` 或 `release`）时，它会自动使用 `captain-definiton` 文件触发构建。要设置这个功能，打开应用设置并填写仓库信息：
- repo：仓库的主 HTTPS 地址。对于 github，格式是 `github.com/someone/something`。确保它**不包含** `https://` 前缀和 `.git` 后缀。
- branch：要跟踪的分支，例如 `master`、`staging` 或 `release`...
- github/bitbucket username(email address)：Captain 下载仓库时使用的用户名。
- github/bitbucket password：对于公开项目，你可以输入任意非空文本，例如 `123456`。
- 或者，不用用户名/密码，改用 SSH Key：确保使用 PEM 格式，其他格式可能无法工作。如果不确定，使用下面的命令：
 ```
ssh-keygen -m PEM -t ed25519 -C "yourname@example.com" -f ./deploykey -q -N ""
```

填写这些信息后，保存配置。然后再次打开应用页面。现在你会看到一个新的 webhook 字段。把这个 webhook 复制到 github/bitbucket 仓库的 webhooks（见下面）。Captain 会监听这个链接上的 POST 请求并触发构建。

#### Github
在这里创建 webhook：
- Project > Settings > Add Webhook > URL：应用页面中的 Captain Webhook，Content Type：`application/json`，
Secret：<留空>，只选择 `push` 事件。
另外，把生成的公钥内容添加到仓库的 deploy keys。


#### Bitbucket
可以在这里添加 Webhooks：
- Project > Settings > Webhooks > Add Webhook > Title：Captain Server，URL：应用页面中的 Captain Webhook。

#### GitLab 和其他
可以用类似方式添加 Webhooks。只要 webhook 会发出 POST 请求，CapRover 就能接收它，并从指定分支的最新 commit 开始构建。
