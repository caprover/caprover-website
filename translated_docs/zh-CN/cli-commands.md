---
id: cli-commands
title: CLI 命令
sidebar_label: CLI 命令
---

<br/>

你可以使用这个 CLI 工具部署应用。首先，用 npm 安装 CLI 工具：
```
npm install -g caprover
```

### 服务器初始化

你首先需要初始化 Captain 服务器。你可以在浏览器中访问 `HTTP://IP_ADDRESS_OF_SERVER:3000`，也可以使用推荐的命令行方式。运行
```
caprover serversetup
```

按提示操作，输入服务器 IP 地址。输入这个 Captain 实例要使用的根域名。如果你不知道 Captain 根域名是什么，请访问 www.caprover.com 查看文档。这是非常关键的一步。之后系统会要求输入电子邮箱。这应是一个有效邮箱，因为它会用于 SSL 证书。启用 HTTPS 后，系统会要求你修改密码。然后就完成了。转到下面的 Deploy 部分，了解如何部署应用。


### 登录

*如果你已经通过命令行完成了 “Server Setup”，可以跳过 “Login” 步骤，因为 “server setup” 会在最后一步自动登录。*

你首先需要登录 Captain 服务器。建议此时已经配置好 HTTPS。不建议通过不安全的明文 HTTP 登录。

要登录服务器，运行下面的命令并回答问题。

```bash
caprover login
```

如果操作成功，你会看到成功提示。

注意：你可以同时登录多台 Captain 服务器。如果你有独立的 staging 和 production 服务器，这特别有用。

### 部署

要部署应用，你首先需要创建 captain-definition 文件，并把它放在项目根目录。对于 nodejs 应用，它应和 package.json 放在同一目录。

一个简单的 nodejs 应用 captain-definition 文件是：

```
 {
  "schemaVersion": 2,
  "templateId": "node/8.7.0"
 }
```

关于 Captain Definition 文件的更多细节，见 [Captain Definition 文件](captain-definition-file.md)。

确认这个文件存在后，运行下面的命令并回答问题：

```bash
caprover deploy
```

然后你会看到应用被上传，之后开始构建。注意构建过程可能需要几分钟，请耐心等待。

如果要使用当前目录之前输入过的值，并且不再提问，使用 `-d` 选项：

```bash
caprover deploy -d
```

或者，你可以使用无状态模式，并以内联方式提供 CapRover 服务器信息：
```bash
caprover deploy -h https://captain.root.domain.com -p password -b branchName -a app-name 
```

如果你想集成 CI/CD 流水线，这会很有用。

#### 选项：
可用参数如下：
- `-d, --default`：使用当前目录之前输入过的值。其他选项不会被考虑。
- `-c, --configFile <file>`：指定用于部署设置的配置文件。
- `-u, --caproverUrl <url>`：设置要部署到的 CapRover 机器 URL。通常格式为 [http[s]://][captain.].your-captain-root.domain。
- `-p, --caproverPassword <password>`：CapRover 机器的密码。当提供了 URL 且未使用 app token 时，会提示输入。
- `-n, --caproverName <name>`：你要部署到的 CapRover 机器名称。可以从已登录机器列表中选择。
- `-a, --caproverApp <app>`：指定你要部署到的 CapRover 机器上的应用名称。可以从该机器上的可用应用列表中选择。
- `-b, --branch <branch>`：指定要部署的 Git 分支。注意未提交和被 git ignore 的文件不会包含在内。
- `-t, --tarFile <tarFile>`：指定 tar 文件路径，该文件必须包含用于部署的 captain-definition 文件。
- `-i, --imageName <image>`：指定要部署的 Docker 镜像。该镜像必须已存在于服务器上，或位于 CapRover 能访问的公共或私有仓库中。
- `--appToken <token>`：可选的应用级认证 token（如需要）。


### 列出已登录服务器

要查看你当前已登录的服务器列表，运行：

```bash
caprover list
```

### 退出登录

运行下面的命令：

```bash
caprover logout
```
