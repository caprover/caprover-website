---
id: netdata
title: 使用 NetData 监控服务器
slug: /server/netdata
---

- 在 dashboard 中打开 **Monitoring**，启用 NetData，即可查看服务器 CPU、内存、磁盘和网络使用情况。
- 使用页面显示的监控链接打开图表。
- 服务器还支持通过 SMTP、Slack、Telegram 和 Pushbullet 发送 NetData 告警。
- 在 dashboard 中设置对应凭据，并确认测试告警能正常送达，再用于生产监控。

排查问题时，应将主机指标与应用日志和[诊断信息](../troubleshooting/diagnostics.md)一起分析。监控既不能替代备份，也无法保证应用始终健康。生产环境还需要单独配置告警和[备份](backup/index.md)。

<span id="source-server-goaccess"></span>

## 使用 GoAccess 分析 HTTP 流量

- GoAccess 根据 NGINX access log 生成每个应用的 HTTP 流量报告。
- 在 dashboard 的监控与分析设置中启用 GoAccess，然后查看指定应用和域名的报告。
- 根据流量规模和磁盘容量，设置日志轮转的 cron 表达式及保留期限。
- CapRover 会校验 cron 表达式，并在 GoAccess 配置中保存保留期限。

- 如果报告为空，请先向应用发送一些请求，等待处理完成并确认对应的 access log 存在。
- 报告只统计经过 CapRover NGINX 的 HTTP 请求，不包含直接的 TCP/UDP 流量。
- 原始日志及报告可能包含敏感信息，需要妥善处理。
- 排查应用错误时还应结合[诊断工具](../troubleshooting/diagnostics.md)和应用日志。
