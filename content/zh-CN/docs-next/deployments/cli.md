---
id: cli
title: 与《国家行动倡议》一起部署
slug: /deployments/cli
---

- 在您的开发机器上安装 CapRover CLI `npm install -g caprover`.
- 首先设置服务器,在其仪表板中创建一个应用程序,并签名到HTTPS仪表板URL:

```bash
caprover login
```

在 Git 项目的根部中,添加一个 `captain-definition` 文档。 对于寄存器 Docker 文件 :

```json
{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}
```

- 运行 `caprover deploy` 从工程目录中选择保存的服务器、应用程序和分支。
- CLI上传承诺的Git内容,开始一个构建,并报告进度.
- 未承诺和Git-ignored文件不包括在内。
- 第一次成功运行后 `caprover deploy -d` 重用该目录的保存选择 。

- 对于预建的图像,请使用 `caprover deploy --imageName IMAGE` 并按要求提供应用程序/服务器信息。
- 将证书保留在外壳历史和CI日志之外; [部署符号](ci-cd/index.md) 更适合应用扫描自动化。
- 见完整 [CLI 命令引用](../reference/cli.md).
