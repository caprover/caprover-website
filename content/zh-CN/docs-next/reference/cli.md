---
id: cli
title: CLI 命令
slug: /reference/cli
---

安装 [CapRover 缩写](https://github.com/caprover/caprover-cli) 在您的计算机上 :

```bash
npm install -g caprover
```

| 命令 | 目的 |
| --- | --- |
| `caprover serversetup` | 初始化服务器和根域 |
| `caprover login` | 保存服务器登录 |
| `caprover list` | 列出已保存的服务器 |
| `caprover deploy` | 部署分支、 归档或镜像 |
| `caprover logout` | 删除已保存的登录 |
| `caprover api` | 调用 API |

## 部署选项

**来源(选择一):**

- `-b, --branch`======================================================================================
- `-t, --tarFile`: 本地归档,包括生成的文件
- `-i, --imageName`: 现有Docker 镜像

**目标与认证 :**

- `-u, --caproverUrl`: 服务器 URL
- `-a, --caproverApp`: 应用名称
- `--appToken` 或 `CAPROVER_APP_TOKEN`: App-scoped 部署令牌
- `-d, --default`: 重用已保存的选择

其他选项 : `-n, --caproverName`, `-p, --caproverPassword`,以及 `-c, --configFile`.

**示例: 部署归档**

```bash
caprover deploy -u https://captain.apps.example.com -a my-app \
  --appToken "$CAPROVER_APP_TOKEN" -t ./deploy.tar
```

- Git 分支部署排除未承诺和忽略的文件 。
- 检查 `caprover deploy --help` 为您安装的版本。
- 保护服务器证书,使其远离已承诺的文件.
- 见 [CLI 部署](../deployments/cli.md) 为走过。
