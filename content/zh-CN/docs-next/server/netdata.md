---
id: netdata
title: 使用NetData进行监控
slug: /server/netdata
---

- 在dashboard,打开 **监测** 并允许NetData检查服务器CPU,内存,磁盘,和网络活动.
- 使用显示的监测链接打开其图表 。
- 服务器还支持SMTP,Slack,Telegram和Pushbullet的可选NetData提醒目的地.
- 在dashboard上配置他们的证书,并核查一份警报通知在依赖它之前到达目的地。

检查应用程序日志和 [诊断](../troubleshooting/diagnostics.md) 与主机的度量衡。 监测不能提供备份或保证应用程序保持健康; [备份](backup/index.md) 用于生产。

<span id="source-server-goaccess"></span>

## HTTP 软件 与 Goaccess 分析

- GoAccess从NGINX访问日志中生成每个应用的HTTP流量报告.
- 在dashboard的监控/分析设置中启用它,然后打开一个应用和域名的报告.
- 设置一个与您的流量和磁盘容量相适应的日志旋转编程和保留期。
- CapRover 验证 cron 表达式,并将保留设置与 GoAccess 配置一同存储.

- 如果报告为空,则生成对所选应用的流量,等待处理,并确认该应用的访问日志存在.
- 这些报告是根据HTTP的要求编写的,这些要求到达了CapRover的NGINX;直接的TCP/UDP流量超出了它们的范围.
- 处理原始记录和报告为潜在的敏感数据。
- 对于应用程序错误, 使用 [诊断](../troubleshooting/diagnostics.md) 还有应用日志
