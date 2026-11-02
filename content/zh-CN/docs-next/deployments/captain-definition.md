---
id: captain-definition
title: Captain Definition
slug: /deployments/captain-definition
---

- `captain-definition` 文件告诉 CapRover 应如何从源码构建，或者使用哪个预构建镜像进行部署。
- 默认将它放在上传项目的根目录。如果应用配置了其他 **Captain Definition Path**，则使用该路径。
- 文件采用 JSON 格式，指定 `schemaVersion: 2`。

如果仓库中已有 Dockerfile：

```json
{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}
```

如果要部署预构建镜像：

```json
{"schemaVersion":2,"imageName":"nginx:stable-alpine"}
```

- 构建方式或镜像来源只能指定一个。`dockerfileLines` 可以直接内嵌 Dockerfile，`templateId` 则选择内置语言模板。
- 在 monorepo 中，可以为每个应用设置不同的定义文件路径；Docker 构建上下文仍然是上传项目的根目录。
- 可用字段及约束参阅 [Captain Definition Schema](../reference/captain-definition.md)。
