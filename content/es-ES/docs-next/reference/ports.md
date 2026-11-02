---
id: ports
title: Puertos de red y cortafuegos
slug: /reference/ports
---

| Puerto | Protocolo | Propósito |
| --- | --- | --- |
| 80 | TCP | HTTP y validación de certificados |
| 443 | TCP | HTTPS |
| 3000 | TCP | Configuración inicial del dashboard de mando |
| 996 | TCP | Registro auto hospedado, si está habilitado |
| 22 | TCP | SSH, o su puerto SSH configurado |
| 2377 | TCP | Gestión del cirmo |
| 7946 | TCP/UDP | Comunicación de los nodos de Swarm |
| 4789 | UDP | Tráfico de transmisiones |

- Sólo SSH, 80, 443, y 3000 son relevantes para la configuración inicial de un solo nodo.
- Restringir los puertos de Swarm a los nodos de racimo de confianza y 3000 después de la configuración de HTTPS de panel.
- Los puertos TCP/UDP publicados específicamente para aplicaciones requieren sus propias reglas de acceso.
- Puertos de acogida personalizados: `CAPTAIN_HOST_HTTP_PORT`, `CAPTAIN_HOST_HTTPS_PORT`, y `CAPTAIN_HOST_ADMIN_PORT`Véase [Server Environment](server-environment.md).
