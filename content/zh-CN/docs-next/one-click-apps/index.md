---
id: index
title: 单击Apps
slug: /one-click-apps
---

<span id="source-one-click-apps-install"></span>

## 安装

One-Click模板创建普通的CapRover应用. 每个模板可能提供多种服务。

- 请检查date=中的日期值 (帮助) 模板需要的变量,镜像,曝光的端口,量,以及安装后的指令.
- 使用唯一的数据库和管理员证书 。
- 持续服务需求 **单独的应用程序数据备份**CapRover 配置备份中不包含数据库卷。
- 实时dashboard目录是当前模板和版本的来源.

<span id="source-one-click-apps-configure"></span>

## 配置

- 生成的app可以使用他们通常的CapRover应用设置来配置.
- 应用一些变量,例如初始数据库密码 **仅在第一次启动时**。后期环境变化不一定更新现有的数据库用户。

<span id="source-one-click-apps-connect"></span>

## 连接服务

- 内部连接示例 : `postgres:5432` (使用实际生成的服务名称和监听端口).
- 对于遗留的应用程序, `srv-captain--` 服务别名仍然有用。
- 在消费应用程序的环境设置中存储证书 。
- 关于CapRover以外的客户,参见 [外部数据库连接](../data-persistence/deploy-databases.md).

<span id="source-one-click-apps-upgrade"></span>

## 升级

- 阅读上游应用程序的迁移指令,并在升级前备份其数据.
- 一个模板可以使用自定义的镜像或初始化脚本. 用平坦的上游镜像取代它可能会失去必要的配置。
- 镜像更改不执行每个数据库或应用程序-schema迁移 。
- 在重新创建或迁移状态应用程序时, 保存和验证已有的量 。

<span id="source-one-click-apps-custom-repositories"></span>

## 自定义 One-Click 应用源

CapRover可以从第三方One-Click仓库装入模板.

- 部署前审查模板:它们可以运行镜像,打开端口,挂载存储,并配置证书.
- 记录哪个寄存器提供了您已安装的应用程序供未来升级 。
- 见 [正在编写 One- Click Apps](authoring.md) 以创建模板。

<span id="source-one-click-apps-troubleshooting"></span>

## 解决问题

识别失败生成的服务 。 查看其日志并检查:

- 模板变量,镜像拉/构建错误,以及证书.
- 端口接触、内部服务名称、卷挂载和放置。
- 数据库是否意外地以空节点本地音量开始 。

在调查期间保留状态的卷子. 在请求帮助时共享已编辑的服务日志,模板名称,以及镜像版本.
