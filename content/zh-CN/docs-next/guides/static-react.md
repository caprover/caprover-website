---
id: static-react
title: 部署静态/ 反应应用程序
slug: /guides/static-react
---

- 在本地建立您的反应或其他静态站点,并服务从一个小的NGINX图像中编译的文件.
- 这保持了CapRover主机的构建时间依赖性.
- 示例使用 Vite 风格 `dist` 目录; 替换为 `build` 如果这就是你的项目产生的结果。

1. 运行 `npm ci && npm run build` 在你的项目。 检查 `dist/index.html` 已存在。
2. 创建一个 `Dockerfile` 在项目根中:

   ```dockerfile
   FROM nginx:stable-alpine
   COPY dist/ /usr/share/nginx/html/
   ```

3. 创建名为的文件 `captain-definition` 并存着 `{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}`.
4. 套装 Docker 文件、 定义和 **已建产出** 从工程根,然后部署归档:

   ```bash
   tar -cf deploy.tar captain-definition Dockerfile dist
   caprover deploy --tarFile ./deploy.tar
   ```

   首先创建 CapRover 网络应用, 并在 CLI 提示您时选择 。 你可以直接上传 `deploy.tar` 联合国 **部署** 选项卡。 设定容器 HTTP 端口为 `80`.
5. 访问应用程序的HTTP地址,然后启用HTTPS并验证公有领域. 重建并重新包装每次新部署的产出。

- 普通的CLI系统 Git 部署用途 `git archive` 并省略未承诺或Git-ignored文件。
- 由于所编译的产出通常被忽略,所以使用上面的焦油工作流程代替 `caprover deploy` 无 `--tarFile`.

对于客户端路线,例如: `/settings`中,插入以下内容 `nginx.conf` 在工程根, 浏览器会刷新应用程序:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
```

添加 `COPY nginx.conf /etc/nginx/conf.d/default.conf` 到 Docker 文件,然后包含 `nginx.conf` 输入 `tar -cf` 以上指挥。 重建并调兵. 不要在构建时变量中隐藏私密:编译的JavaScript是公开的. 如果应用程序有API,请单独部署,并将前端指向其HTTPS URL.
