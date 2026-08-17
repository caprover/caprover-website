---
id: troubleshooting
title: 排查问题
sidebar_label: 排查问题
---

<br/>

这一节覆盖用户最常遇到的问题。

## 无法连接 <ip_server>:3000？

这可能有一整套原因。

#### 第一）

你需要确认 CapRover 正在服务器上运行。要检查这一点，SSH 到服务器并运行

```bash
docker service ps captain-captain --no-trunc
```

你可能会看到 Captain 因为错误而不断重启。修复问题后重试。例如，见 [error creating vxlan interface](https://github.com/caprover/caprover/issues/14#issuecomment-345447689)，或 [error while creating mount source path](https://github.com/caprover/caprover/issues/352)。Linode 例如就有很多问题，例如 [subnet sandbox join failed](https://github.com/docker/machine/issues/2753#issuecomment-171822791) 和 [vxlan interface](https://github.com/docker/machine/issues/2753#issuecomment-188353704)。在 [CapRover Github issues](https://github.com/caprover/caprover/issues) 中搜索你的问题；如果找不到解决方案，在 Github 上创建一个新 issue。

#### 第二）

如果运行 `docker service ps captain-captain --no-trunc` 时没有看到任何错误，然后尝试

```bash
docker service logs captain-captain --since 60m

## you should also get the logs from nginx

docker service logs captain-nginx --since 60m
```

你可能会看到 CapRover 因为错误而不断重启。在 [CapRover Github issues](https://github.com/caprover/caprover/issues) 中搜索你的问题；如果找不到解决方案，在 Github 上创建一个新 issue。

#### 第三）

如果上面解释的 “第一” 和 “第二” 调试步骤都正常，日志中也没有错误，在服务器上运行这条命令：

```bash
 curl localhost:3000 -v
```

如果成功，很可能是防火墙在阻止连接。见 [防火墙文档](firewall.md)。

## 部署成功，但出现 502 bad gateway 错误！

如果你符合以下情况，这一节适用于你：

- 你已经能设置服务器，并通过 `captain.rootdomain.example.com` 访问它。
- 你已经能成功部署其中一个示例应用（见[这里](https://github.com/caprover/caprover/tree/master/captain-sample-apps)），并且它工作正常。
- 你尝试部署自己的应用，部署成功了，但通过 `yourappname.root.example.com` 访问时得到 502 错误。

如果以上几点都正确，按下面的方式排查：

- SSH 到服务器并查看应用日志。确保它没有崩溃，并且正在运行。要查看日志，请见本页末尾的 “[How to view my application's log](#how-to-view-my-applications-log)”
- 如果应用日志显示应用正在运行，最常见的情况是应用绑定到了自定义端口，而不是端口 80。例如，CouchDB 运行在端口 5984。这时，打开 CapRover 上的应用设置，进入 HTTP Settings，然后把 “Container Port” 选为 5984。
- 如果你的应用把绑定 IP 地址定义为 127.0.0.1，把它改成 `0.0.0.0`，更多细节见[这个问题](https://github.com/caprover/caprover/issues/76#issuecomment-481053496)。

## 域名验证失败 - Error 1107！

当 CapRover 无法验证 yourcustomdomain.com 指向 CapRover 的 IP 地址时，就会发生这种情况。这可能由多个因素引起：

- DNS 更改最多需要 24 小时才能传播，尤其是服务器之前缓存过它们时。因此先等待 24 小时再重试。如果仍然不行，继续下一步：
- 要确认，打开 https://mxtoolbox.com/DNSLookup.aspx 并输入 `yourcustomdomain.com`。确保它指向服务器 IP。如果你使用 CloudFlare 这类代理服务，这可能导致问题。在 CloudFlare 的 DNS 中禁用他们的代理，让 A record 直接指向 CapRover 服务器的 IP 地址。
- 如果你测试了以上所有步骤，并且访问 `something.domain.com` 时能看到 CapRover 页面，那么可以说域名工作正常，但 CapRover 无法验证它，因为回环测试不工作。这时，你可以选择跳过 CapRover 做的域名验证：

```
echo  "{\"skipVerifyingDomains\":\"true\"}" >  /captain/data/config-override.json
docker service update captain-captain --force
```

- 如果以上都不行，请在 Github 上开一个 issue。
- **AWS EC2 用户** - 检查你的 VPC CIDR Block 是否高于 172.0.0.0/16（不是常见的 0.0.0.0/16）。

## 连接超时

有时，当你有一个不活动的数据库连接池时，Docker 会在一段时间后断开连接。要修复，你可以做以下任一操作：

- 实现自动重试策略
- 每隔几分钟自动 ping 一次，确保连接不会变成不活动
- 更改应用中的 Keepalive 配置（knex 的例子见[这里](https://github.com/caprover/caprover/issues/873#issuecomment-715328966)）
- 更改 Docker 配置（更高级）

[根本原因](https://github.com/moby/moby/issues/31208)与 CapRover 无关，这是底层 Docker 问题。

## Something bad happened

当你在 UI 中看到这个错误时，意味着发生了 “意外” 问题，例如连接丢失、服务器崩溃（因内存不足）等。查看发生了什么的最好方法是获取服务器日志：

```
docker service logs captain-captain --since 5m --follow
```

## 如何查看应用日志？

你的应用是作为 Docker 服务部署的。例如，如果应用在 captain 中的名称是 `my-app`，你可以通过 SSH 连接到服务器并运行下面的命令查看日志：

```
docker service logs srv-captain--my-app --since 60m --follow
```

注意 Docker 服务名称带有 `srv-captain--` 前缀。你也可以把 60m 替换成 10m，以查看最近 10 分钟。

## 如何重启应用？

如果应用表现不正常，你可以尝试强制重启它：打开 Web 控制台并选择应用，然后点击 “Save Configuration & Update” 按钮。它会强制重启应用。

## 如何在应用内（容器内）运行 shell

运行下面的命令即可：

```
docker exec -it $(docker ps --filter name=srv-captain--myappname -q) /bin/sh
```

当然，你需要把 `myappname` 替换成自己的应用名。

## 我改了 Nginx 配置，结果把管理 UI 弄坏了！

这种情况下重启帮不上忙。[按这样做](https://github.com/caprover/caprover/issues/412#issuecomment-484077130)：

运行 nginx fixer，以回退**你手动做过的所有 nginx 更改**：

```bash
docker service scale captain-captain=0 && \
docker run -it --rm -v /captain:/captain  caprover/caprover /bin/sh -c "wget https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/clear-custom-nginx.js ; node clear-custom-nginx.js ;" && \
docker service scale captain-captain=1 && \
echo "OKAY"

```

希望问题已经解决，你可以放心了。

## 如何重启 CapRover

如果 CapRover 表现不正常，你可以尝试用下面的命令强制重启 CapRover：

```
docker service update captain-captain --force
```

## 如何使用 Edge 版本

每次向 master 推送时，都会自动构建 Edge 版本。如果你的版本有一个刚在 master 分支修复的特定缺陷，可以临时把 CapRover 更新到 Edge 版本。注意，一旦切换到 edge，你将不会收到更新。等到下一个 CapRover 版本发布时，你必须手动切回 CapRover。注意这是一项高级操作。另外，作为经验法则，一旦切换到 Edge，在新版本发布之前不要切回常规版本。

要切换到 edge

```
docker pull caprover/caprover-edge:latest
docker service update captain-captain --image caprover/caprover-edge:latest
```

要切回主镜像

```
docker service update captain-captain --image caprover/caprover:latest
```

## 自定义配置设置

你可以通过在 `/captain/data/config-override.json` 添加一个 JSON 文件，自定义 [CaptainConstants](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) 中 configs 下定义的任何常量。例如，要更改 `defaultMaxLogSize`，`/captain/data/config-override.json` 的内容应是：

```
{
 "defaultMaxLogSize":"128m"
}
```

编辑这个文件后，[重启 CapRover](https://caprover.com/docs/troubleshooting.html#how-to-restart-caprover)（如果更改会影响 CapRover、nginx 或 certbot），或从 UI 中关闭再打开 NetData。

## 使用现有 swarm

第一次安装 CapRover 时，它会尝试自动为你设置一个 swarm 集群。但在少数情况下，你可能已经有一个 swarm 集群，并想使用那个集群。这时，你只需把 `useExistingSwarm` 设为 true 来覆盖它。在尝试安装 CapRover 之前运行下面的脚本。

```
mkdir -p  /captain/data
echo  "{\"useExistingSwarm\":\"true\"}" >  /captain/data/config-override.json
```

## AWS 设置

AWS 在端口处理等方面有自己的定制。它可能需要一些自定义设置，例如见[这篇博文](https://fuzzyblog.io/blog/caprover/2019/11/10/using-caprover-on-aws.html)。

## CloudFlare SSL 设置

使用 CloudFlare 免费计划时，记住它的 [Universal SSL 只支持到第 1 级子域名的 SSL](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/#full-setup)。因此，如果你启用 CloudFlare 的 Universal SSL，并把一个第 1 级子域名设为 CapRover 的根域名，访问 CapRover 部署的应用时会得到下面的错误：

```
This site can’t provide a secure connection
app.root.example.com uses an unsupported protocol.
ERR_SSL_VERSION_OR_CIPHER_MISMATCH
```

如果你想把 CapRover 和 CloudFlare 的 Universal SSL 一起使用，避免把子域名用作根域名。

## ARM 处理器

从 1.8.1 开始，CapRover 可以在 “raspberry pi” 这类 arm 处理器上工作。注意，一些一键应用可能无法在 raspberry pi 上工作。一键应用是外部应用，不由 CapRover 维护。

## 重置密码

如果你忘记了密码，但可以通过 SSH 访问服务器：

- SSH 到服务器
- 运行 `jq -V`，确认已安装 jq
- 运行

```bash
docker service scale captain-captain=0

# backup config
cp /captain/data/config-captain.json /captain/data/config-captain.json.backup

# delete old password
jq 'del(.hashedPassword)' /captain/data/config-captain.json > /captain/data/config-captain.json.new
cat /captain/data/config-captain.json.new > /captain/data/config-captain.json
rm /captain/data/config-captain.json.new

# set a temporary password
docker service update --env-add DEFAULT_PASSWORD=mytemppassword captain-captain
docker service scale captain-captain=1
```

- 用临时密码登录 CapRover，然后在 settings 中修改密码。

## 如何停止并删除 Captain？

CapRover 使用 docker swarm 来支持集群，并在容器停止时重启它们。要从系统中完全卸载 CapRover，运行：

```
docker service rm $(docker service ls -q)
## remove CapRover settings directory
rm -rf /captain
## leave swarm if you don't want it
docker swarm leave --force
## full cleanup of docker
docker system prune --all --force
```

## 我收到 Let's Encrypt 的邮件，说我的域名 SSL 证书即将过期，但这不应该发生。

当你以前的项目使用过同一个域名，后来删除了该项目时，就会发生这种情况。
Let's Encrypt 会跟踪旧证书，并在它即将过期时通知你，但这不影响新证书。
要确认，只需用在线工具检查 SSL 过期日期，例如：
https://www.sslshopper.com/ssl-checker.html#hostname=captain.server.demo.caprover.com
