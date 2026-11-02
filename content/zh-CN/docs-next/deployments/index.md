---
id: index
title: 部署
slug: /deployments
---

<span id="source-deployments-dashboard"></span>

## 从Dashboard部署

- 在其中创建应用程序 **应用程序**,打开其 **部署** 选项卡,并选择适合您工程的输入。
- 为了部署一个档案,将项目包装为 `captain-definition` 在预期路径上的文件,并上传柏油文件。
- dashboard还接受在不需要源文件时粘贴在文本输入中的Captain Definition.

例如,粘贴此定义以部署现有的公共镜像:

```json
{"schemaVersion":2,"imageName":"nginx:stable-alpine"}
```

- 开始部署,监视构建或拉动状态,然后验证应用程序的容器HTTP端口及其默认域.
- 对于私人镜像,请先配置registry 凭据。
- 见 [部署Docker 镜像](index.md).

<span id="source-deployments-docker-image"></span>

## 部署Docker 镜像

构建并推进您的镜像到注册, 或者使用公共镜像 。 创建 CapRover 应用程序, 然后粘贴到其仅镜像定义中 **部署** 选项卡:

```json
{
  "schemaVersion": 2,
  "imageName": "nginx:stable-alpine"
}
```

- 该镜像必须可供 CapRover 服务器访问 。
- 私人registry的全权证书应列在 [镜像仓库](registries/index.md) 在部署之前
- 您还可以使用 `caprover deploy --imageName IMAGE` 从CLI。

- 部署后, 将 app 的容器 HTTP 端口设置为端口, 镜像会实际监听, 或将一个worker/ 数据库应用标签为非网络 。
- 校验服务及应用日志.
- 偏好明确标签或文摘,以可预测地展开生产;漂浮标签以后可能会解决不同的镜像.
