---
id: upgrade
title: 升级 CapRover
slug: /server/upgrade
---

在升级之前 [下载 CapRover 备份](backup/index.md) 并分别备份应用程序数据和音量。 检查释放笔记,确认您的 Docker 主机有足够的自由磁盘空间 。

- 在仪表板,打开 **设置** 并检查当前版本、可用版本和更改日志。
- 报告更新可用时使用仪表板更新动作.
- CapRover 拖动选中的图像并更新 `captain-captain` 道克服务.
- 允许服务时间重新启动,然后验证仪表板,部署应用,注册,和HTTPS.

- 如果更新失败, 请检查 `docker service ps captain-captain --no-trunc` 和 `docker service logs captain-captain --tail 100` 在管理器节点。
- 在尝试回滚前保存备份和上一个图像标记; 见 [诊断](../troubleshooting/diagnostics.md).

## 测试边缘图像

- 对于仅存在于边缘图像的固定线的高级临时测试,记录准确的当前图像。 `docker service inspect captain-captain`,备份 CapRover 和应用程序数据,然后将服务图像更新为 a **特定测试的边缘标签或文摘** 使用 `docker service update captain-captain --image IMAGE`.
- 这绕过了仪表板的正常版本流.
- 边缘图像可能不支持降级到目前发布的版本;等待兼容的发布或者在切换回之前恢复已测试的备份.
- 在任何手动更新后验证仪表板、应用程序和服务日志。
