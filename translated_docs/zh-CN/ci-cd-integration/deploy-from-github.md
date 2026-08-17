---
id: deploy-from-github
title: 从 GitHub 构建、测试并部署
sidebar_label: 从 GitHub 部署
---

## 直接从 Github 部署

这个例子展示了一个带 PHP 后端的 Vue 3 应用，如何使用 CapRover 社区维护的 [GitHub Action](https://github.com/caprover/deploy-from-github)，直接从 Github 构建、测试并部署到 CapRover。欢迎从 https://github.com/PremoWeb/SDK-Foundation-Vue 克隆示例项目来试用，或构建你的下一个应用。

### 创建新应用

你在这里选择的名称会成为 APP_NAME secret。

![Create a new app](/img/docs/deploy-from-github/create-a-new-app.png "Create a new app")

### 启用 App Token

找到新应用的 “Deployment” 标签，点击 Enable App Token 并复制这个 token。这就是你的 APP_TOKEN secret。

![Create a new app](/img/docs/deploy-from-github/enable-app-token.png "Enable App Token")

### 添加 Github Secrets

![Add the Github Secrets](/img/docs/deploy-from-github/create-github-secrets.png "Add your Github Secrets")

<hr />

![Creating a secret](/img/docs/deploy-from-github/adding-a-secret.png "Creating a secret")

_对 APP_TOKEN 和 CAPROVER_SERVER secrets 重复这个过程。_

注意：CapRover 服务器必须是 “https://captain.apps.your-domain.com” 这种格式。你可以把 CAPROVER_SERVER 设为所有私有和/或公开项目的 Global Secret。

<hr />

### 向项目添加文件

使用这种方法部署到 CapRover，你至少需要两个文件。

第一个文件是 `captain-definition`，CapRover 部署应用时会使用它。另一个文件是 workflow yaml 文件，Github Actions 会用它在部署前处理项目。

新 Workflow 文件的内容应保存为 `.github/workflows/deploy.yml`：

```
name: Build & Deploy

on:
  push:
    branches: [ "main" ]

  pull_request:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - name: Check out repository
        uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
      - run: npm ci
      - run: npm run build --if-present
      - run: npm run test --if-present

      - uses: a7ul/tar-action@v1.1.0
        with:
          command: c
          cwd: "./"
          files: |
            backend/
            frontend/dist/
            captain-definition
          outPath: deploy.tar

      - name: Deploy App to CapRover
        uses: caprover/deploy-from-github@v1.0.1
        with:
          server: '${{ secrets.CAPROVER_SERVER }}'
          app: '${{ secrets.APP_NAME }}'
          token: '${{ secrets.APP_TOKEN }}'
```

上面内容的简要说明：

第一步是检出并用 NPM 构建应用的 Vue 3 前端。构建输出位于 frontend/dist/。如果存在测试，应用也会在第二步之前完成测试。

第二步把 `backend/`、`frontend/dist/` 目录和 `captain-definition` 文件复制进 deploy.tar 文件。

最后一步会把 tarball 文件发送到 CapRover，以便 CapRover 开始部署应用。

### 提交代码更改即可部署！

当你把文件提交到项目仓库的 “main” 分支时，Github Actions 会开始处理 Workflow 文件。完成后，几秒钟内你就会在 Caprover 上看到已部署的应用。Github 看到的任何错误都会自动发邮件通知你。没有邮件就表示部署成功。

<hr />

### 替代方法（更高效）

或者，你甚至可以在 Github 上构建 Docker 镜像，然后只把构建产物部署到 CapRover 实例。这会有帮助，因为它不会消耗 CapRover 实例的 RAM 和 CPU 来构建镜像。

要实现这一点，我们需要按以下步骤操作：用 GitHub Actions 构建 Docker 镜像，用 GitHub Packages 存储它，然后部署到 CapRover。

#### 创建 GitHub Personal Access Token

你需要创建一个具有 **packages 写权限** 的 GitHub Personal Access Token。

如果你以前没有创建过，GitHub 有一份很好的 personal access token 指南。链接在这里：https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

#### 创建新应用

如果你在 CapRover 上还没有应用，按[这里](#create-a-new-app)的说明创建一个

如果你已经有应用，可以跳过这一步。

#### 启用 App Token

如果你的应用还没有 app token，按[这里](#enable-app-token)的说明创建一个

如果你已有 app token，先把它放在手边，下一步会用到。

#### 添加 GitHub Secrets

你需要把以下信息加入 GitHub Secrets：

- App Name：CapRover 中的应用名称
- App Token：上一步获得的 app token
- CapRover Server URL：CapRover 服务器的 URL
- GitHub Token：你在上一步创建的 GitHub Personal Access Token

你可以按[这里](#add-the-github-secrets)的说明添加 GitHub Secrets

#### 向 CapRover 添加私有 Docker Registry

要从 GitHub Packages 拉取镜像，你需要向 CapRover 添加一个私有 Docker registry。如果你以前没有做过，可以按[这里](https://caprover.com/docs/app-scaling-and-cluster.html#add-a-private-docker-registry)的说明操作

使用这些值：

- Username：`<your github username>`
- Password：`<your github personal access token>`
- Domain：`ghcr.io`（不要 www，不要 http）
- Image Prefix：`<your github username or your org username>`（如果你从与用户名不同的组织拉取镜像）

> 如果你的 image prefix 是 github 用户名，prefix 必须是小写

#### 创建 GitHub Action

GitHub Actions 是内置在 GitHub 中的 CI/CD 流水线。如果你不熟悉它，最好先阅读 GitHub 的 Understanding GitHub Actions 文档了解基础：https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions

下面是一个示例 GitHub Action：每次向 pull request 推送时构建 docker 容器，并部署到 CapRover 服务器（这是开发环境设置的好例子）

```
name: Build and Deploy Docker Image

on: [pull_request]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Check out repository
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to Container Registry
      uses: docker/login-action@v3
      with:
            registry: ghcr.io
            username: ${{ github.repository_owner }}
            password: ${{ secrets.GITHUB_TOKEN }}

    - name: Preset Image Name
      run: echo "IMAGE_URL=$(echo ghcr.io/${{ github.repository_owner }}/${{ github.event.repository.name }}:$(echo ${{ github.sha }} | cut -c1-7) | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV

    - name: Build and push Docker Image
      uses: docker/build-push-action@v5
      with:
        context: .
        file: ./Dockerfile
        push: true
        tags: ${{ env.IMAGE_URL }}

    - name: Deploy Image to CapRrover
      uses: caprover/deploy-from-github@v1.1.2
      with:
        server: "${{ secrets.CAPROVER_SERVER }}"
        app: "${{ secrets.APP_NAME }}"
        token: "${{ secrets.APP_TOKEN }}"
        image: ${{ env.IMAGE_URL }}
```

下面简要说明 action 中每一步的作用：

1. **Check out repository**：这一步使用 action `actions/checkout@v2`，这是一个预定义的 GitHub Action，让工作流可以访问仓库内容。checkout action 会把仓库克隆到 runner（GitHub Actions 用来执行工作流的虚拟环境），这样工作流中的后续步骤都可以操作它。
2. **Set up Docker Buildx**：这一步使用 action `docker/setup-buildx-action@v1`，这是一个用于设置 Docker Buildx 的 Docker action。它可以提供更高级的容器构建能力。
3. **Login to Container Registry**：这一步使用 `docker/login-action@v2` 登录 GitHub Container Registry（ghcr.io），使用仓库所有者用户名和 GitHub Token（GITHUB_TOKEN）。这个 token 必须事先保存在仓库的 secrets 中。
4. **Preset Image Name**：这是一条 shell 命令，用于构造 Docker 镜像 URL。它使用 GitHub 仓库所有者、仓库名称和当前 commit 的 SHA（截取前 7 个字符）构造 URL，把所有大写字符转成小写，然后把这个 URL 写入 `GITHUB_ENV`，以便后续步骤把它作为环境变量使用。
5. **Build and push Docker Image**：这一步使用 `docker/build-push-action@v4`，用仓库中的 Dockerfile 构建 Docker 镜像，并把它推送到上一步设置的 GitHub Container Registry URL。`context: .` 表示构建上下文是当前目录（也就是仓库根目录）。
6. **Deploy Image to CapRover**：这一步使用 `caprover/deploy-from-github@v1.1.2` action，把刚刚构建并推送的 Docker 镜像部署到 CapRover。CapRover 服务器、应用名称和访问 token 的细节来自仓库的 secrets。Docker 镜像 URL 来自之前设置的环境变量。

#### 部署！

实现这些更改后，把它们 commit + push 到仓库，然后看魔法发生 🪄

### 需要帮助？

提供商业和社区支持。细节见 [帮助与支持](/docs/support.html "Help and Support") 页面。
