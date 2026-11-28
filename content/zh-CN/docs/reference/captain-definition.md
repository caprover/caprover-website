---
id: captain-definition
title: Captain Definition Schema
slug: /reference/captain-definition
---

部署包根目录中的 `captain-definition` 文件用于告诉 CapRover 如何部署应用。[源码接口](https://github.com/caprover/caprover/blob/master/src/models/ICaptainDefinition.ts)包含 `schemaVersion` 和四种部署方式。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `schemaVersion` | number | 必填；当前解析器支持 `2`。 |
| `imageName` | string | 拉取并部署已有的 Docker 镜像。 |
| `dockerfilePath` | string | 部署归档中的 Dockerfile 路径；不允许使用指向父目录的路径。 |
| `dockerfileLines` | string[] | 在定义中直接给出 Dockerfile 的各行内容。 |
| `templateId` | string | 使用内置 Dockerfile 模板。 |

四种部署方式中必须**恰好指定一种**。[解析器](https://github.com/caprover/caprover/blob/master/src/user/ImageMaker.ts)会拒绝未指定或同时指定多种方式的配置。

```json
{"schemaVersion": 2, "imageName": "nginx:stable-alpine"}
```

使用 `imageName` 时，如果要从源码重新构建镜像，需要提交新的定义。Dockerfile 部署示例参见[静态网站与 React](../guides/static-react.md)。

## 内置模板及版本

`templateId` 使用 `NAME/VERSION` 格式，例如：

```json
{"schemaVersion":2,"templateId":"node/24"}
```

CapRover 的[模板定义](https://github.com/caprover/caprover/blob/master/src/user/TemplateHelper.ts)使用以下官方镜像标签生成 Dockerfile：

| `NAME` | `NAME/VERSION` 对应的基础镜像 |
| --- | --- |
| `node` | `node:VERSION-alpine` |
| `php` | `php:VERSION-apache` |
| `python-django` | `python:VERSION-alpine` |
| `ruby-rack` | `ruby:VERSION-alpine` |

- `node/24` 对应的基础镜像为 `node:24-alpine`。
- 标签必须在上游 registry 中存在。只指定主版本的标签以后可能指向更新的镜像。
- 各模板的 Dockerfile 生成逻辑见 CapRover 的 [`dockerfiles` 目录](https://github.com/caprover/caprover/tree/master/dockerfiles)。
- 使用模板前应检查对应的框架假设及版本要求。
- 对其他框架，建议在项目仓库中维护自己的 Dockerfile，以便固定镜像 tag 或 digest 并控制构建流程。
