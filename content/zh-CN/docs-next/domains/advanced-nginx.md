---
id: advanced-nginx
title: 高级 NGINX 配置
slug: /domains/advanced-nginx
---

- CapRover 允许在服务器设置中修改 NGINX 基础配置和 dashboard 路由模板，也可以从应用的 HTTP 设置修改对应应用的 NGINX 模板。
- 如果只有单个应用需要调整超时、大小限制或路由规则，优先使用应用级配置。

- `/captain/generated/nginx` 下的文件反映了最终生成的配置，但 CapRover 可能覆盖它们。
- 请通过 dashboard 中对应的模板保存修改。
- 宿主机目录 `/captain/data/nginx-shared` 会以 `/nginx-shared` 路径挂载到 NGINX 容器中，可用于共享自定义证书等文件。

- 如果希望对新创建的应用使用默认模板，可以让 CapRover 从 `/captain/data/server-block-conf-override.ejs` 加载覆盖文件。
- 以对应的[源码模板](https://github.com/caprover/caprover/blob/master/template/server-block-conf.ejs)为基础，先备份，写入 override 后重启 CapRover service。
- 在测试应用上验证配置后再广泛使用。
- 无效的全局模板可能影响 dashboard 和多个应用。

## NGINX 配置错误导致 dashboard 无法打开时

- 如果自定义 NGINX 配置导致 dashboard 无法访问，先备份 `/captain/data/config-captain.json` 和任何 `/captain/data/server-block-conf-override.ejs` 文件。
- 如果是后一个文件导致故障，先将它移出该目录，再重启 CapRover。
- 如果仍无法恢复，下面的操作会**清除 NGINX 基础配置、dashboard 配置及所有应用的自定义 NGINX 配置**。务必保留原始备份，以便之后逐项恢复。
- 在已安装 `jq` 的 manager 节点执行：

```bash
sudo cp -a /captain/data/config-captain.json /captain/data/config-captain.json.before-nginx-reset
sudo jq '.nginxBaseConfig = "" | .nginxCaptainConfig = "" | .appDefinitions |= with_entries(.value.customNginxConfig = "")' \
  /captain/data/config-captain.json | sudo tee /captain/data/config-captain.json.new >/dev/null
sudo jq empty /captain/data/config-captain.json.new
sudo docker service scale captain-captain=0
sudo install -m 600 /captain/data/config-captain.json.new /captain/data/config-captain.json
sudo docker service scale captain-captain=1
```

- 等待 `docker service ps captain-captain` 和 `docker service ps captain-nginx` 显示正常运行的任务。
- 如果问题仍然存在，请查看日志并恢复备份，避免继续修改扩大影响。

<span id="source-domains-nginx-routing"></span>

## NGINX 请求路由

- 对公网 Web 请求，DNS 首先将 hostname 指向 CapRover 服务器。
- CapRover NGINX 接收 80 或 443 端口的流量，根据 hostname 选择 dashboard 或应用域名，再转发到应用 Docker service 的 HTTP 容器端口。

- 部署成功后仍出现 502，通常意味着 NGINX 无法通过对应端口访问健康的容器。
- 确认应用监听 `0.0.0.0`、**Container HTTP Port** 设置正确，且 Docker service 任务正常运行。
- DNS 故障发生在请求到达该路由之前；证书错误可能在 HTTPS 流量到达应用前出现。

应用专用 NGINX 配置应在其 [Custom NGINX](advanced-nginx.md) 设置中调整。全局模板影响更多路由，请谨慎使用[高级 NGINX 配置](advanced-nginx.md)。

<span id="source-applications-advanced-custom-nginx"></span>

## Custom NGINX

- CapRover 为每个 Web 应用生成 NGINX 配置。
- 如果需要针对某个应用调整 timeout、上传大小限制等高级行为，可以在 **HTTP Settings** 中编辑对应模板。

1. 编辑前先备份当前模板。
2. 只修改必要的指令，并通过 dashboard 保存。
3. 验证 NGINX 配置已被接受，然后测试应用关联的全部域名是否都能通过 HTTP 和 HTTPS 访问。同一应用的模板会影响其所有域名。

- 错误的配置可能导致请求路由中断。
- CapRover 会尝试校验并回退无效配置，但仍应保存最后一份可用的模板。
- `/captain/generated/nginx` 下的文件是生成结果，CapRover 可能随时覆盖，不应直接编辑。

如果必须修改全局 NGINX 或 dashboard 模板，参阅[高级 NGINX 配置](advanced-nginx.md)。只有应用级模板无法满足需求时，才使用全局配置。
