---
id: index
title: 应用程序
slug: /applications
---

<span id="source-applications-create-manage"></span>

## 应用程序设置

- **网络应用 :** CapRover路线通过NGINX请求到配置的容器HTTP端口.
- **私人服务:** 选择 **不要作为网络应用程序曝光** 用于没有HTTP终点的工人或数据库。
- **听讯地址:** 您的网络进程应该绑定到 `0.0.0.0` 在容器内。
- **删除应用程序 :** 备份任何 Docker 卷、 绑定挂载或外部数据 。 删除该应用程序不构成备份 。

关于源/图像部署选项,见 [部署](../deployments/index.md).

<span id="source-applications-projects"></span>

## 项目

- 组织应用到项目和嵌套项目.
- 项目只是组织性的。 它们不提供网络隔离或接入边界。

<span id="source-applications-tags-descriptions"></span>

## 标记和说明

- 描述和标签使得应用程序更容易找到.
- 标记可以横跨项目;既不能设定变化的网络,部署,也不能设置孤立.

<span id="source-applications-environment-variables"></span>

## 环境变量

- 运行时变量与应用程序的服务配置一同存储.
- 图像回滚 **没有** 恢复旧的变量值。
- App配置和CapRover备份可能包含一些秘密. 将证书保存在存储处之外, `captain-definition` 文档。

对于非机密 Dockerfile 构建参数 :

```dockerfile
ARG PUBLIC_BUILD_VALUE
ENV PUBLIC_BUILD_VALUE=${PUBLIC_BUILD_VALUE}
```

CapRover 还提供 `CAPROVER_GIT_COMMIT_SHA` 在源建时。 构建值可能嵌入到生成的图像中.

<span id="source-applications-http-settings"></span>

## HTTP 设置

- **默认域 :** `<app-name>.<root-domain>`。见 [域和 HTTPS](../domains/index.md).
- **集装箱 HTTP 端口 :** 输入进程必须匹配端口 。
- **HTTP 基本认证 :** 限制HTTP访问;应用程序特定的用户授权仍然分开.
- **重定向域 :** 在启用重定向前确认目的地主机名可达 。
- **公共TCP/UDP端口:** 使用明确发布的端口映射. 见 [防火墙和网络建设](../domains/firewall.md).
