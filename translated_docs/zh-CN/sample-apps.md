---
id: sample-apps
title: 示例应用
sidebar_label: 示例应用
---

<br/>
CapRover 构建在 Docker 容器之上。因此，几乎所有应用都可以部署到 CapRover。正如 `captain-definition` 文档所说，对于 NodeJS、PHP、python 和 ruby 这些最常见的 Web 语言，有几种简单的 `captain-definition` 版本。

不过，CapRover 并不限于这些语言。例如，它可以部署一个 go 应用。你只需要一个 Dockerfile。


### 可以直接部署！

在 CapRover 仓库中，你可以找到一组已经准备好部署的不同示例应用。见：
https://github.com/caprover/caprover/tree/master/captain-sample-apps

其中包括：
- ASP .NET
- Go app
- nginx advance app
- Python
- Ruby
- Elixir/Phoenix/LiveView
- NodeJS
- React App
- 以及更多...


要部署示例应用，你只需要：
- 下载你选择的 tar 文件。
- 打开 CapRover Web 控制台，创建一个测试应用。
- 打开 “Deployment” 标签，上传 tar 文件。
- 完成！

现在你可以解压 tar 内容，看看里面有什么。这会帮你理解如何用 CapRover（Docker）部署不同应用。


### 社区应用

一组来自社区的示例应用。

#### CapRover Django

这个项目模板旨在提供一个更接近真实世界的 Django 模板，包括：
- PostgreSQL
- CapRover 安装说明
- Django settings 处理

在 [GitLab](https://gitlab.com/kamneros/caprover-django) 查看代码和文档。

另外，你也可以在[这里](https://blog.kenshuri.com/posts/006_from_heroku_to_capRover.md)找到把 Django 应用部署到 CapRover 的分步教程。

#### CapRover Laravel

- [jackbrycesmith/laravel-caprover-template](https://github.com/jackbrycesmith/laravel-caprover-template)

#### Elixir/Phoenix 应用部署
部署一个带诊断控制台的 Elixir/Phoenix LiveView Web 应用。

- [拖放 tarball](https://github.com/TehSnappy/phoenix_sample/releases/download/v1.0/phoenix_sample.tar)
- [应用代码链接](https://github.com/TehSnappy/phoenix_sample)
