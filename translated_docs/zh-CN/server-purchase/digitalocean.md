---
id: digitalocean
title: 在 DigitalOcean 上安装 CapRover
sidebar_label: DigitalOcean
---


如果这是你第一次配置服务器，DigitalOcean 可能是最简单的方案。另外，你可以使用这个链接获得 $100 额度。
https://m.do.co/c/6410aa23d3f3

DigitalOcean 把他们的服务器称为 “Droplets”。注册后，打开 Droplets 部分，点击 “Create Droplet”。在 choose an image 下，点击 One-Click Apps，然后选择 Docker。这样服务器会预装 Docker。如果你有 SSH key，在这个 Droplet Create 页面底部输入你的 SSH key；如果没有，也不用担心，它只是另一种密码。Droplet 创建完成后，你会收到一封包含服务器 IP 地址、用户和密码的邮件。如果你知道如何 SSH，那就很好，SSH 进入服务器。如果不知道，也不用担心。DigitalOcean 对新手很友好。直接打开 DigitalOcean 账号中的 Droplets 部分，点击你创建的 Droplet。从左侧菜单选择 ACCESS 并 launch console。当提示 login 时输入 `root`，然后输入邮件中收到的密码。如果邮件里没有收到密码，点击 Launch Console 按钮下面的 Reset Root Password。注意你必须手动输入这个很长的密码。DigitalOcean 提供的 Web 界面不支持 Copy/Paste ctrl+c ctrl+v。

此时你已经登录服务器，可以按 Getting Started 部分的说明运行 captain installer。
