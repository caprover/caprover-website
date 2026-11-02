---
id: server-environment
title: 服务器环境变量
slug: /reference/server-environment
---

这个 [环境变量分析器](https://github.com/caprover/caprover/blob/master/src/utils/EnvVars.ts) 确认这些服务器级输入 :

| 名称 | 效果 |
| --- | --- |
| `ACCEPTED_TERMS` | 在初始发射时接受安装条件. |
| `DEFAULT_PASSWORD` | 设置初始dashboard密码; 设置后替换. |
| `CAPTAIN_HOST_HTTP_PORT`, `CAPTAIN_HOST_HTTPS_PORT`, `CAPTAIN_HOST_ADMIN_PORT` | 已发布host 端口;默认为80,443和3000. 匹配 Docker 的主机侧面 `-p` 测绘. |
| `MAIN_NODE_IP_ADDRESS` | 在自动检测不合适时提供管理器地址进行安装. |
| `CAPTAIN_BASE_DIRECTORY` | 覆盖默认 `/captain` 基础目录。 |
| `CAPROVER_DISABLE_ANALYTICS`, `DO_NOT_TRACK` | 设定时禁用分析 。 |
| `CAPTAIN_DOCKER_API` | 覆盖DockerAPI连接细节. |
| `CAPTAIN_IS_DEBUG`, `IS_CAPTAIN_INSTANCE`, `DEMO_MODE_ADMIN_IP`, `FORCE_ENABLE_PRO`, `BY_PASS_PROXY_CHECK` | 内部,开发,或特殊目的控制;仅在读取其源用后使用. |

- 当变量为真时, 解析器将多个布尔标签视为真 **非空字符串**; 传递字串 `false` 不一定把它们关掉。
- 初始容器指令的供应安装变量和使用 [配置覆盖](server-environment.md) 用于配置服务器常数。

<span id="source-reference-config-override"></span>

## 配置覆盖。 json

CapRover 从 `/captain/data/config-override.json`键。 `configs` 输入 [队长](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) 用于此文件。 示例

```json
{"defaultMaxLogSize": "256m"}
```

- 在更改文件前备份文件,使用有效的JSON,并重新启动 CapRover 服务以启动设置以生效.
- 不正确的覆盖可以防止启动或削弱域验证.
- 在修改数值之前审查实际源默认值和安装版本; `skipVerifyingDomains` 用于受控制的例外设置,而不是例行的公共安装。

此文件位于 `/captain/data`,因此它包含在 [CapRover 备份](../server/backup/index.md).
