---
id: captain-definition
title: Captain Definition Schema
slug: /reference/captain-definition
---

名为文件 `captain-definition` 在部署根 告诉CapRover 部署什么。 内容 [源接口](https://github.com/caprover/caprover/blob/master/src/models/ICaptainDefinition.ts) 包含 `schemaVersion` 和四个可能的部署选择者。

| 外地 | 类型 | 含义 |
| --- | --- | --- |
| `schemaVersion` | 编号 | 需要; 当前解析器接受 `2`. |
| `imageName` | 字符串 | 拖动并部署已有的 Docker 镜像 。 |
| `dockerfilePath` | 字符串 | 部署归档中的 Docker 文件路径 。 家长指导路径被拒绝. |
| `dockerfileLines` | 字符串 [] | 内线Dockerfile的行数 。 |
| `templateId` | 字符串 | 使用内置的Dockerfile模板. |

提供 **一个** 四个选择者中。 这个 [解析器](https://github.com/caprover/caprover/blob/master/src/user/ImageMaker.ts) 不允许缺少选择器或指定多个选择器。

```json
{"schemaVersion": 2, "imageName": "nginx:stable-alpine"}
```

`imageName` 没有新的定义,无法从源头重建部署。 关于一个Dockerfile的例子,见: [静态/ 反应](../guides/static-react.md).

## 内置模板和版本

`templateId` 有窗体 `NAME/VERSION`例如:

```json
{"schemaVersion":2,"templateId":"node/24"}
```

卡普罗弗 [模板定义](https://github.com/caprover/caprover/blob/master/src/user/TemplateHelper.ts) 使用这些官方镜像标签生成 Dockerfile :

| `NAME` | 基本镜像用于 `NAME/VERSION` |
| --- | --- |
| `node` | `node:VERSION-alpine` |
| `php` | `php:VERSION-apache` |
| `python-django` | `python:VERSION-alpine` |
| `ruby-rack` | `ruby:VERSION-alpine` |

- 对于 `node/24`,其基础是 `node:24-alpine`.
- 标签必须存在于相关的上游镜像registry中,一个主要唯一的标签可以在镜像更新时移动。
- 模板专用的 Dockerfile 指令在 CapRover 中 [`dockerfiles` 目录](https://github.com/caprover/caprover/tree/master/dockerfiles).
- 在依赖模板的框架假设或更改版本之前先检查它们.
- 一个寄存器拥有的 Dockerfile 允许您将精确的镜像标签或消化并控制其他框架的构建.
