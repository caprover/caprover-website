---
id: play-with-docker
title: 试用 CapRover
sidebar_label: 试用 CapRover
---

<br/>

## 只读演示

如果你只想看只读演示，打开[首页](/)并点击 **Live Demo**

<br/>

## 可操作演示

如果你想创建一个可工作的 CapRover 实例，可以使用 Play-with-Docker 网站。这个网站可以让你在数秒内创建虚拟服务器，并在其上安装 Docker 镜像。这是试用 CapRover 的最佳场地。


![](/img/pwd-caprover.gif)


按这些步骤操作：
- 确保你有 [Docker Hub](https://hub.docker.com/) 账号。如果没有，创建一个，完全免费。
- 打开 [play-with-docker.com](http://play-with-docker.com/)
- 点击 Start，并用 Docker Hub 用户名/密码登录
- 会话开始后，你会看到一个带计时器的页面
- 你可以点击左侧菜单栏的 **+ADD NEW INSTANCE**，创建一个虚拟服务器
- 服务器创建后，复制并粘贴这条命令：
```bash
 curl -L https://pwd.caprover.com | bash
```

- 安装过程大约需要 2 分钟，并且是全自动的。
- 安装完成后，你会看到类似这样的消息：
```
===================================
===================================
 **** Installation is done! *****  
CapRover is available at http://captain.ip123456789123456.direct.labs.play-with-docker.com
Default password is: captain42
===================================
===================================
```

复制 URL，并用 `captain42` 作为密码登录 CapRover。

**重要：** 使用 play-with-docker 时无法启用 HTTPS，但其他功能应可正常工作。
