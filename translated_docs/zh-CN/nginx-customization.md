---
id: nginx-customization
title: NGINX 配置
sidebar_label: NGINX 配置
---

## 配置自定义

虽然 CapRover 会自动管理把 HTTP 请求路由到应用的全部工作，你仍可能想手动调整一些特殊配置值。例如针对特殊文件类型或路由的缓存逻辑、超时自定义、最大请求体大小，以及许多其他可以通过 nginx 手动调整的参数。

CapRover 允许你通过完全自定义的配置文件手动调整这些参数。你可以调整三个区域：

- NGINX 基础配置文件（容器内的 `/etc/nginx/nginx.conf`）。这是 NGINX 首先查看的文件。它会让 nginx 查找其他配置文件。你可以在 Web 控制台的 settings 中手动调整这个文件。
- CapRover 配置文件（容器内的 `/etc/nginx/conf.d/captain-root.conf`）。这是你作为开发者访问 `captain.root.domain.com` 时会交互的配置文件。通常你不需要修改它。如果需要，可以在 Web 控制台 > settings 中修改。
- 应用专用配置文件（容器内的 `/etc/nginx/conf.d/captain.conf`）。这里可以更改特定应用的设置。例如，你有一个视频上传应用，希望允许传入请求体大小为 1GB。你可以打开 Web 控制台 > Apps > Apps Edit，并手动修改这个参数。注意，你做的任何更改只应用于这个特定应用，其他应用仍使用默认配置。这个配置模板会应用于指向该应用的所有域名，也就是说，Captain 会为 `my-app-name.captainroot.domain.com` 创建一个 server block，并可能为 `www.myapp.com` 等创建另一个 server block。

修改模板后，你可以在 `caprover/caprover` Docker 镜像内查看编译后的 nginx 配置，路径是 `/captain/generated/nginx`（`docker exec -it docker_container_id /bin/sh`），通过检查下面列出的文件，确认最终编译结果是否符合预期。注意，你不能手动修改这些文件，因为它们会被 Captain 覆盖。如果要做任何更改，应始终在 CapRover 控制台中修改 Nginx 模板。

- `/captain/generated/nginx/nginx.conf` – 生成的 NGINX 基础配置文件
- `/captain/generated/nginx/conf.d/captain-root.conf` – 生成的 CapRover 配置文件
- `/captain/generated/nginx/conf.d/captain.conf` – 生成的应用专用配置文件

## 自定义文件和目录

除了配置自定义，你可能还需要在 nginx 容器中使用一些文件，例如自定义 SSL 证书、特定静态资源等。在 CapRover 实例中，所有内容（包括 nginx）都位于独立容器中，因此你需要把主机上的目录映射到容器。Captain 已经为你做了这件事。服务器上的 `/captain/data/nginx-shared` 目录，在 nginx 容器中可用作 `/nginx-shared`。假设你把自定义 SSL 证书放在该目录，并命名为 `/captain/data/nginx-shared/custom-cert.pem`。要在 nginx 配置中引用该文件，使用 `/nginx-shared/custom-cert.pem`


## 自定义并覆盖所有应用的 NGINX 配置

注意：从 1.11 版本开始可用

要修改新创建应用的默认 NGINX 配置，以便加入 IP 白名单和其他 NGINX 配置。

1- 从 CapRover GitHub 仓库获取一份 `server-block-conf.ejs` 模板。[**这里**](https://github.com/caprover/caprover/blob/master/template/server-block-conf.ejs)

2- 创建文件 `/captain/data/server-block-conf-override.ejs`，复制模板内容，并做所需修改。
假设你用 `-v /captain:/captain` 启动 CapRover Docker（默认设置）

3- 重启 CapRover，以便读取覆盖文件内容：`docker service update --force captain-captain`
