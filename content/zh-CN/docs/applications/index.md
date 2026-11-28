---
id: index
title: 应用管理
slug: /applications
---

<span id="source-applications-create-manage"></span>

## 应用设置

- **Web 应用：**CapRover 通过 NGINX 将请求转发到指定的容器 HTTP 端口。
- **内部服务：**如果 worker 或数据库无需对外提供 HTTP 服务，请选择 **Do not expose as web app**。
- **监听地址：**容器内的 Web 进程应监听 `0.0.0.0`。
- **删除应用：**先备份相关 Docker 数据卷、bind mount 和外部数据。删除应用并不会自动创建备份。

关于从代码或镜像部署应用的方式，请参阅[部署](../deployments/index.md)。

<span id="source-applications-projects"></span>

## 项目

- 可以使用项目和子项目组织应用。
- 项目仅用于分类管理，不提供网络隔离或访问控制边界。

<span id="source-applications-tags-descriptions"></span>

## 标签与描述

- 描述和标签方便搜索应用。
- 标签可以跨项目使用，不会改变应用的网络、部署方式或隔离级别。

<span id="source-applications-environment-variables"></span>

## 环境变量

- 运行时环境变量保存在应用的 Docker service 配置中。
- 回滚镜像版本**不会**恢复旧的环境变量值。
- 应用配置和 CapRover 备份可能包含敏感信息。不要将凭据写入代码仓库或 `captain-definition` 文件。

对于不包含敏感信息的 Dockerfile 构建参数：

```dockerfile
ARG PUBLIC_BUILD_VALUE
ENV PUBLIC_BUILD_VALUE=${PUBLIC_BUILD_VALUE}
```

从源码构建时，CapRover 还会提供 `CAPROVER_GIT_COMMIT_SHA`。构建参数的值可能被写入最终镜像。

<span id="source-applications-http-settings"></span>

## HTTP 设置

- **默认域名：**`<app-name>.<root-domain>`。参阅[域名与 HTTPS](../domains/index.md)。
- **Container HTTP Port：**必须与应用进程实际监听的端口一致。
- **HTTP Basic Authentication：**可以限制 HTTP 访问；应用内部的用户授权仍需单独实现。
- **域名重定向：**启用前先确认目标域名可以访问。
- **公开的 TCP/UDP 端口：**请明确配置端口映射。参阅[防火墙与网络](../domains/firewall.md)。
