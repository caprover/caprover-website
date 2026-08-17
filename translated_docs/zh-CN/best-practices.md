---
id: best-practices
title: 最佳实践
sidebar_label: 最佳实践
---

CapRover 的设计目标是易用且直观。即便如此，仍有一些提示和技巧能帮你更好地使用 CapRover。

### 隐藏根域名

隐藏你的技术栈，不让潜在攻击者轻易看到，始终是好习惯。为了更安全，你可以把根域名藏到比通配符 DNS 设置更深两级的位置。例如，在 DNS 面板中设置

```bash
A RECORD:

*.server.domain.com   >>>>   123.123.123.123
```

然后在设置 CapRover 时，不要输入 `server.domain.com`，而是输入 `something.server.domain.com`。这样，你可以通过 `captain.something.server.domain.com` 访问控制台，而不是 `captain.server.domain.com`。然后你可以在应用的 HTTP 设置中把应用域名设为 `myapp.server.domain.com`，以隐藏根域名。

记住，这并不能保护你免受所有攻击。它只是一项安全措施，会让一些暴力攻击者更难、甚至几乎无法攻击你的 CapRover 基础设施。

### 自定义默认密码

CapRover 使用 `captain42` 作为默认密码。这通常是安全的，因为服务器安装完成后，你可以从本机运行 `caprover serversetup` 立即修改密码。不过，这会留下大约 30 秒的窗口，攻击者可能在你之前修改密码。这种情况不太可能发生，但并非不可能。攻击者需要知道特定机器上的确切攻击窗口。无论如何，为了降低这个风险，安装 CapRover 时只需把 `DEFAULT_PASSWORD` 环境变量加入安装脚本，选择一个自定义初始密码。例如，下面的脚本把默认密码从 `captain42` 改成 `myinitialpassword`

```bash
docker run -e ACCEPTED_TERMS=true -e DEFAULT_PASSWORD='myinitialpassword' -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

### 强制 HTTPS

强烈建议你首先做的事情之一，就是为 CapRover 控制台启用 HTTPS，并启用 “Enforce HTTPS”。完成这些后，你应修改密码。注意，如果你使用 `caprover serversetup` 向导，这个过程会自动完成，安装后不需要再改密码。

### 为 Git 使用服务账号

CapRover 最受欢迎的功能之一，是从源代码管理（GitHub、BitBucket、GitLab 等）自动部署。要让这个方法用于私有仓库，你必须输入用户名/密码，它们会作为加密内容保存在服务器上。始终建议在 GitHub 等平台上创建一个服务账号（机器人账号），并只给该账号特定仓库的特定权限（只读）。这样即使该账号被攻破，你的主账号仍然完好，你也可以把被攻破的账号从仓库中移除。

### 构建时内存不足

当你在 Heroku 这类付费服务上构建时，构建过程发生在 CPU 和 RAM 较高的机器上。当你使用 CapRover 时，构建发生在服务应用的同一台机器上。在应用变得太大、构建过程需要过多 RAM 之前，这通常不是问题。到那时，构建过程可能崩溃。例如见[**这个**](https://github.com/caprover/caprover/issues/315)。有多种解决方案：

1- 给 Web 服务器添加 swap 空间，说明见[**这里**](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04)。

2- 在本机构建。例如，Create React App 的这个过程在[**这里**](recipe-deploy-create-react-app.md)有详细说明。

3- 不过，**最好的方案**是使用独立的构建系统。指南见[**这里**](ci-cd-integration.md)

### 为新应用自定义 NGINX 配置

已移至 https://caprover.com/docs/nginx-customization.html#customize-and-override-the-nginx-config-for-all-apps

保留这一节是为了避免链接失效。
