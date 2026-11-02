---
id: netdata
title: Supervisión con NetData
slug: /server/netdata
---

- En el dashboard, abierto **Supervisión** y permitir NetData inspeccionar el servidor CPU, memoria, disco y actividad de red.
- Utilice el enlace de monitoreo mostrado para abrir sus gráficos.
- El servidor también admite destinos opcionales de alerta NetData para SMTP, Slack, Telegram y Pushbullet.
- Configure sus credenciales en el dashboard y verifique que una notificación de alerta llegue al destino antes de confiar en él.

Compruebe los registros de aplicaciones y [Diagnósticos](../troubleshooting/diagnostics.md) junto a las métricas de host. El monitoreo no proporciona una copia de seguridad o garantiza que las aplicaciones permanecen sanas; configura alertas separadas y [backups](backup/index.md) para producción.

<span id="source-server-goaccess"></span>

## HTTP Análisis con GoAccess

- GoAccess produce informes de tráfico HTTP por aplicación de los registros de acceso NGINX.
- Hágalo en la configuración de monitoreo/análisis del dashboard, y luego abra los informes para una aplicación y dominio.
- Establecer un cronograma de rotación de registros y un período de retención apropiado para su tráfico y capacidad de disco.
- CapRover valida la expresión cron y almacena el ajuste de retención con la configuración GoAccess.

- Si un informe está vacío, genera tráfico a la aplicación seleccionada, espera el procesamiento y confirma que existen los registros de acceso de la aplicación.
- Los informes se basan en solicitudes HTTP que llegan al NGINX de CapRover; el tráfico directo TCP/UDP está fuera de su alcance.
- Maneja registros e informes brutos como datos potencialmente sensibles.
- Para errores de aplicación, use [Diagnósticos](../troubleshooting/diagnostics.md) y registros de aplicaciones también.
