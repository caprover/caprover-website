---
id: static-react
title: 部署静态网站或 React 应用
slug: /guides/static-react
---

- 在本地构建 React 应用或其他静态网站，再通过轻量的 NGINX 镜像提供构建后的文件。
- 这样可以避免在 CapRover 服务器上安装构建依赖。
- 本示例使用 Vite 常见的 `dist` 输出目录。如果项目生成的是 `build`，请相应修改路径。

1. 在项目中运行 `npm ci && npm run build`，确认生成了 `dist/index.html`。
2. 在项目根目录创建 `Dockerfile`：

   ```dockerfile
   FROM nginx:stable-alpine
   COPY dist/ /usr/share/nginx/html/
   ```

3. 在同一目录创建 `captain-definition` 文件，内容为 `{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}`。
4. 将 Dockerfile、Captain Definition 和**构建产物**打包，然后部署：

   ```bash
   tar -cf deploy.tar captain-definition Dockerfile dist
   caprover deploy --tarFile ./deploy.tar
   ```

   先在 CapRover 中创建 Web 应用，CLI 提示时选择该应用。也可以在应用的 **Deployment** 标签页上传 `deploy.tar`。将 **Container HTTP Port** 设置为 `80`。
5. 访问应用的 HTTP 地址，然后启用 HTTPS 并验证公网域名。每次部署新版本时，都要重新构建并打包。

- CLI 默认的 Git 部署使用 `git archive`，不会包含未提交或被 Git 忽略的文件。
- 构建产物通常位于 `.gitignore` 中，因此请使用上面的 tar 方式，而不要直接运行不带 `--tarFile` 的 `caprover deploy`。

如果前端使用客户端路由，例如 `/settings`，请在项目根目录创建如下 `nginx.conf`，确保刷新页面时能正确加载应用：

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
```

在 Dockerfile 中加入 `COPY nginx.conf /etc/nginx/conf.d/default.conf`，并在上面的 `tar -cf` 命令中包含 `nginx.conf`，然后重新构建并部署。不要将私密凭据放进构建时的变量，因为编译后的 JavaScript 对外公开。如果应用需要后端 API，请单独部署后端，并让前端访问它的 HTTPS URL。
