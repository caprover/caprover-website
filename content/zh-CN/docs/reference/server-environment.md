---
id: server-environment
title: 服务器环境变量
slug: /reference/server-environment
---

[环境变量解析器](https://github.com/caprover/caprover/blob/master/src/utils/EnvVars.ts)支持以下服务器级参数：

| 名称 | 作用 |
| --- | --- |
| `ACCEPTED_TERMS` | 首次启动时接受安装条款。 |
| `DEFAULT_PASSWORD` | 设置 dashboard 初始密码；安装后应修改。 |
| `CAPTAIN_HOST_HTTP_PORT`、`CAPTAIN_HOST_HTTPS_PORT`、`CAPTAIN_HOST_ADMIN_PORT` | 宿主机发布端口，默认是 80、443 和 3000。必须与 Docker `-p` 参数的宿主机端口一致。 |
| `MAIN_NODE_IP_ADDRESS` | 自动检测不合适时，指定安装所用的 manager IP 地址。 |
| `CAPTAIN_BASE_DIRECTORY` | 覆盖默认基础目录 `/captain`。 |
| `CAPROVER_DISABLE_ANALYTICS`、`DO_NOT_TRACK` | 设置后关闭分析功能。 |
| `CAPTAIN_DOCKER_API` | 覆盖 Docker API 连接参数。 |
| `CAPTAIN_IS_DEBUG`、`IS_CAPTAIN_INSTANCE`、`DEMO_MODE_ADMIN_IP`、`FORCE_ENABLE_PRO`、`BY_PASS_PROXY_CHECK` | 内部、开发或特殊用途的配置项；使用前先阅读源码。 |

- 部分布尔选项只要环境变量是**非空字符串**就会被视为 true，因此字面字符串 `false` 不一定会关闭选项。
- 安装参数需要传给首次启动的容器命令。对于可调整的服务器常量，请使用[配置 override](server-environment.md)。

<span id="source-reference-config-override"></span>

## config-override.json

CapRover 从 `/captain/data/config-override.json` 读取覆盖配置。只有 [CaptainConstants.ts](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) 中 `configs` 对象下的键适合通过此文件调整。例如：

```json
{"defaultMaxLogSize": "256m"}
```

- 修改前先备份文件，使用合法 JSON，并在需要修改启动参数时重启 CapRover service。
- 错误的 override 可能导致服务无法启动，或削弱域名验证安全性。
- 修改配置前请检查对应版本的源码默认值。`skipVerifyingDomains` 只适用于受控的特殊环境，不推荐用于常规公网安装。

该文件位于 `/captain/data`，因此会包含在 [CapRover 备份](../server/backup/index.md)中。
