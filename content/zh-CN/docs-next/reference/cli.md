---
id: cli
title: CLI 命令参考
slug: /reference/cli
---

在自己的电脑上安装 [CapRover CLI](https://github.com/caprover/caprover-cli)：

```bash
npm install -g caprover
```

| 命令 | 用途 |
| --- | --- |
| `caprover serversetup` | 初始化服务器与根域名 |
| `caprover login` | 保存服务器登录信息 |
| `caprover list` | 列出已保存的服务器 |
| `caprover deploy` | 部署 Git 分支、归档或镜像 |
| `caprover logout` | 删除已保存的登录信息 |
| `caprover api` | 调用 API |

## 部署参数

**来源（选择一种）：**

- `-b, --branch`：已提交的 Git 分支。
- `-t, --tarFile`：本地归档，可包含构建生成的文件。
- `-i, --imageName`：已有的 Docker 镜像。

**目标与身份验证：**

- `-u, --caproverUrl`：服务器 URL。
- `-a, --caproverApp`：应用名称。
- `--appToken` 或 `CAPROVER_APP_TOKEN`：限定为单个应用的部署 token。
- `-d, --default`：复用保存的选项。

其他参数：`-n, --caproverName`、`-p, --caproverPassword` 和 `-c, --configFile`。

**示例：部署归档**

```bash
caprover deploy -u https://captain.apps.example.com -a my-app \
  --appToken "$CAPROVER_APP_TOKEN" -t ./deploy.tar
```

- 从 Git 分支部署时，不包含未提交或已被忽略的文件。
- 具体参数以当前版本的 `caprover deploy --help` 为准。
- 保护服务器凭据，不要将其提交到代码仓库。
- 完整流程参阅 [CLI 部署](../deployments/cli.md)。
