---
id: captain-definition
title: 船长定义
slug: /deployments/captain-definition
---

- A `captain-definition` 文件告诉 CapRover 如何构建源头或哪个预建的图像来部署。
- 把它放在上传工程的根部, 除非设置不同的 **队长定义路径** 用于应用。
- 格式为 JSON 与 `schemaVersion: 2`.

对于寄存器 Docker 文件 :

```json
{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}
```

对于预建的图像 :

```json
{"schemaVersion":2,"imageName":"nginx:stable-alpine"}
```

- 精确使用一个构建/图像源 。 `dockerfileLines` 可以定义内置的 Docker 文件,以及 `templateId` 选择内置语言模板。
- 对于一个单列波,每个应用程序设置一个单独的定义路径;上传的项目根仍然是多克构建上下文.
- 见 [船长定义Schema](../reference/captain-definition.md) 用于支持的密钥和制约。
