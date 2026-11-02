---
id: index
title: 部署应用
slug: /deployments
---

<span id="source-deployments-dashboard"></span>

## 通过 dashboard 部署

- 在 **Apps** 中创建应用，打开 **Deployment** 标签页，选择适合项目的部署方式。
- 如果上传归档文件，请将项目和对应的 `captain-definition` 一起打包到指定路径，再上传 tar 文件。
- 如果部署不需要源代码文件，也可以直接在 dashboard 的文本输入框粘贴 Captain Definition。

例如，使用下面的定义部署已有的公开镜像：

```json
{"schemaVersion":2,"imageName":"nginx:stable-alpine"}
```

- 开始部署，查看镜像构建或拉取进度，然后确认容器 HTTP 端口及默认域名。
- 如果镜像存放在私有 registry，先配置拉取凭据。
- 参阅[部署 Docker 镜像](index.md)。

<span id="source-deployments-docker-image"></span>

## 部署 Docker 镜像

可以先构建镜像并推送到 registry，也可以直接使用公开镜像。在 CapRover 中创建应用，然后在 **Deployment** 标签页粘贴仅指定镜像的定义：

```json
{
  "schemaVersion": 2,
  "imageName": "nginx:stable-alpine"
}
```

- CapRover 服务器必须能够访问该镜像。
- 使用私有 registry 时，部署前先在 [Container Registries](registries/index.md) 中配置凭据。
- 也可以通过 CLI 执行 `caprover deploy --imageName IMAGE`。

- 部署完成后，将容器 HTTP 端口设置为镜像中服务实际监听的端口；worker 或数据库应设置为非 Web 应用。
- 查看 Docker service 和应用日志，确认运行正常。
- 生产环境建议固定镜像 tag 或 digest，避免浮动 tag 在后续部署时解析到不同镜像。
