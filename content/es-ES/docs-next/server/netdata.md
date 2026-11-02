---
id: netdata
title: Monitorización con NetData
slug: /server/netdata
---

- En el dashboard, abre **Monitoring** y activa NetData para consultar el consumo de CPU, memoria, disco y tráfico de red del servidor.
- Usa el enlace de monitorización para abrir las gráficas.
- El servidor también admite destinos de alertas de NetData mediante SMTP, Slack, Telegram y Pushbullet.
- Configura las credenciales desde el dashboard y verifica que llega una alerta de prueba antes de depender de esas notificaciones.

Consulta los logs de las aplicaciones y [Diagnósticos](../troubleshooting/diagnostics.md) junto con las métricas del host. La monitorización no sustituye a los backups ni garantiza que las aplicaciones estén sanas; configura alertas adicionales y [backups](backup/index.md) para producción.

<span id="source-server-goaccess"></span>

## Analítica HTTP con GoAccess

- GoAccess genera informes de tráfico HTTP por aplicación a partir de los logs de acceso de NGINX.
- Actívalo desde los ajustes de monitorización y analítica del dashboard y abre los informes de la aplicación y el dominio.
- Configura una expresión cron para rotar logs y un periodo de retención adecuado para el tráfico y la capacidad de disco.
- CapRover valida la expresión cron y guarda el periodo de retención en la configuración de GoAccess.

- Si el informe está vacío, genera tráfico en la aplicación, espera a que se procese y comprueba que existan logs de acceso.
- Los informes solo incluyen peticiones HTTP que llegan al NGINX de CapRover. El tráfico TCP/UDP directo queda fuera de su alcance.
- Trata los logs sin procesar y los informes como datos potencialmente sensibles.
- Para errores de aplicaciones, revisa también [Diagnósticos](../troubleshooting/diagnostics.md) y sus logs.
