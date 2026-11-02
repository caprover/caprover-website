---
id: advanced-nginx
title: 高级 NGINX 配置
slug: /domains/advanced-nginx
---

- CapRover允许您通过服务器设置编辑其基础NGINX配置和dashboard路由模板,并通过该应用程序的HTTP设置编辑一个app的NGINX模板.
- 当只有一个应用需要不同的限制或路由规则时,更倾向于应用特定修改.

- 正在生成文件 `/captain/generated/nginx` 显示有效的输出, 但 CapRover 可以覆盖它们 。
- 通过相关的dashboard模板保存更改.
- 主机目录 `/captain/data/nginx-shared` 装在 NGINX 容器中作为 `/nginx-shared` 用于自定义证书等辅助文件。

- CapRover 可改为: `/captain/data/server-block-conf-override.ejs`.
- 从匹配开始 [源模板](https://github.com/caprover/caprover/blob/master/template/server-block-conf.ejs),保留备份,并在写入覆盖后重新启动 CapRover 服务。
- 在广泛应用之前,先用一次性应用程序测试结果的配置 。
- 一个无效的全球模板可以影响dashboard和多个应用.

## 从损坏dashboard的配置回收

- 如果dashboard由于自定义的 NGINX 设置而无法加载,则首先保存 `/captain/data/config-captain.json` 和任何 `/captain/data/server-block-conf-override.ejs` 文档。
- 如果后者造成故障,在重启CapRover之前将其移出该位置.
- 否则,以下 **清除自定义基础、dashboard和每个应用程序的 NGINX 配置**;保留备份,以便日后恢复单个更改。
- 运行管理器 `jq` 已安装 :

```bash
sudo cp -a /captain/data/config-captain.json /captain/data/config-captain.json.before-nginx-reset
sudo jq '.nginxBaseConfig = "" | .nginxCaptainConfig = "" | .appDefinitions |= with_entries(.value.customNginxConfig = "")' \
  /captain/data/config-captain.json | sudo tee /captain/data/config-captain.json.new >/dev/null
sudo jq empty /captain/data/config-captain.json.new
sudo docker service scale captain-captain=0
sudo install -m 600 /captain/data/config-captain.json.new /captain/data/config-captain.json
sudo docker service scale captain-captain=1
```

- 等着 `docker service ps captain-captain` 和 `docker service ps captain-nginx` 以显示健康的任务。
- 如果无法解决问题, 请检查他们的日志, 在尝试其他更改之前恢复您的备份 。

<span id="source-domains-nginx-routing"></span>

## NGINX 路线

- 对于公共网络请求,DNS在CapRover服务器上指向一个主机名.
- CapRover的NGINX服务在80或443上接收流量,选择匹配的dashboard或应用域,并将请求转发给该应用在其配置的容器HTTP端口的Docker服务.

- 在成功部署后,502项反应通常意味着NGINX无法到达该端口的健康容器。
- 确认应用程序监听 `0.0.0.0`,容器 HTTP 端口正确,Docker服务任务正在运行中.
- 在此路由路径之前发生DNS故障,而在HTTPS流量到达应用之前可能发生证书故障.

App特定 NGINX 更改属于该应用程序 [自定义 NGINX](advanced-nginx.md) 设置。 全局模板影响更多路径; 使用 [高级 NGINX 配置](advanced-nginx.md) 小心点

<span id="source-applications-advanced-custom-nginx"></span>

## 自定义 NGINX

- CapRover为每个Web 应用生成NGINX配置.
- 使用应用程序 **HTTP 设置** 以编辑其NGINX模板,当您需要特定路由的超时,上传限制,或者标准控制不暴露的其他NGINX行为.

1. 在编辑前保存当前模板的副本 。
2. 更改最小的相关指令并将其保存在dashboard上.
3. 验证dashboard接受NGINX配置,然后在HTTP和HTTPS上测试应用程序上所附的每一个域. 共享应用模板共同影响这些域.

- 无效的配置可以中断路由.
- CapRover验证并试图还原无效的应用程序配置,但保留最后一个工作模板以快速恢复.
- 正在生成文件 `/captain/generated/nginx` 是输出,而不是编辑的源; CapRover 可以覆盖它们。

关于全球NGINX或dashboard模板的更改,见 [高级 NGINX 配置](advanced-nginx.md)。只有当特定应用程序模板无法满足您的需要时,才使用这一更广泛的范围。
