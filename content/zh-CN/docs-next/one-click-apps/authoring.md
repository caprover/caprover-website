---
id: authoring
title: 正在编写 One- Click Apps
slug: /one-click-apps/authoring
---

- One-Click模板描述服务及其安装输入.
- 在当前模型中,一个模板宣告 `captainVersion`, a `services` 地图,以及 `caproverOneClickApp` 带有显示名称、变量和开始/结束指令的元数据。
- 服务支持一个有文件记录的类似编译字段的子集 + `caproverExtra` 用于 CapRover 特定的 HTTP 和构建设置。

- 故意选择镜像标签,提供有意义的可变标签和验证,持续状态数据,避免不安全的默认证书或不必要的发布端口.
- 在一次性服务器上测试安装,检查每个生成的应用程序,验证指令,并进行新的安装和恢复路径.

- 对于准确的字段名称和类型,请使用 [单击 App Schema](../reference/one-click-schema.md) 和当前 [单击应用程序仓库](https://github.com/caprover/one-click-apps).
- 该目录是动态的;避免记录一个固定的应用名称列表,好像它得到了保证.
