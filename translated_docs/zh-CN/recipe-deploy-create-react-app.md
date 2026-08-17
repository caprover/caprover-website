---
id: recipe-deploy-create-react-app
title: 静态 React 应用
sidebar_label: 静态 React 应用
---


## 示例应用

见 [sample apps directory](https://github.com/caprover/caprover/tree/master/captain-sample-apps)，那里有一个可以直接部署的 React App。虽然那个目录中的例子很好，但如果你的服务器 RAM 不够，且 package.json 有太多依赖，构建过程可能在服务器上因内存耗尽而崩溃。这时，你可以按下面的步骤在本机（例如笔记本）构建应用，并把构建后的代码部署到服务器。


## 在本机构建

下面是一个把 `create-react-app` 部署为静态站点的简短分步指南。
常规的 `caprover deploy` 会把源文件部署到 `NodeJS` 容器，然后构建应用，并运行一个小型 node server 来提供文件。本指南说明如何在本地构建，并把静态包部署到一个简单的静态服务器容器。

这种方法的最大优势是，构建发生在你自己的机器上，那里已经有 `node_modules`，而且计算能力通常比服务器更强。你也只上传压缩后的文件，而不是整个代码库。因此，部署更快，对服务器的计算压力也更小。

虽然本指南以 `create-react-app` 为例，你也可以把同样的方法用于任何静态项目（VueJS、Parcel、Angular...）。

#### 构建应用

首先，为生产环境构建应用。

```bash
npm run build
```

#### 创建 `captain-definition`

然后在项目根目录创建 `captain-definition`：

```json
{
  "schemaVersion": 2,
  "dockerfileLines": [
    "FROM socialengine/nginx-spa:latest", 
    "COPY ./build /app", 
    "RUN chmod -R 777 /app"
  ]
}
```

这个 `captain-definition` 使用 `socialengine/nginx-spa`，它是一个简单的静态 nginx 服务器，可以处理 `pushState`（每个请求都会路由到 `/index.html`，因此你可以使用前端路由）。

**注意**：如果你的 `build` 输出目录不是 `build`，需要把 `COPY ./build /app` 改成 `COPY ./[my-output-folder] /app`

#### 创建 `tar` 文件

现在你需要创建一个 `tar` 文件。通常你不必这样做，因为 `caprover deploy` 会从 git 仓库为你创建一个。但这里我们不想把仓库内容放进 `tar`，只想放入静态文件和 `captain-definition` 文件。

```bash
tar -cvf ./deploy.tar --exclude='*.map' ./captain-definition ./build/*
```

**注意**：如果你的 `build` 输出目录不是 `build`，需要把 `./build/*` 替换为 `./[my-output-folder]/*`

**注意**：我们也排除了 `.map` 文件，因为这些文件通常很大，会让上传更慢。如果你希望生产环境包含 `.map` 文件，只需去掉 `--exclude='*.map'`。

**提示**：把 `deploy.tar` 加入 `.gitignore`，避免不小心推上去 😉

#### 使用 `caprover` 部署

现在我们只需要使用 `caprover` CLI，并加上 `-t` 参数，使用我们自己的 `tar` 文件，而不是从 git 仓库生成的那个。

```bash
caprover deploy -t ./deploy.tar
```

然后像往常一样回答问题，等待上传完成，然后就可以了。
