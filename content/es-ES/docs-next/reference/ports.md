---
id: ports
title: Puertos de red y firewall
slug: /reference/ports
---

| Puerto | Protocolo | Uso |
| --- | --- | --- |
| 80 | TCP | HTTP y validación de certificados |
| 443 | TCP | HTTPS |
| 3000 | TCP | Configuración inicial del dashboard |
| 996 | TCP | Registry autohospedado, si está habilitado |
| 22 | TCP | SSH o el puerto SSH personalizado |
| 2377 | TCP | Gestión de Docker Swarm |
| 7946 | TCP/UDP | Comunicación entre nodos Swarm |
| 4789 | UDP | Tráfico de la red overlay de Swarm |

- Para instalar un servidor de un solo nodo, únicamente necesitas SSH y los puertos 80, 443 y 3000.
- Restringe los puertos de Swarm a los nodos de confianza. Limita el acceso público al puerto 3000 cuando el dashboard ya funcione por HTTPS.
- Si una aplicación publica puertos TCP/UDP adicionales, debes configurar las reglas de acceso correspondientes.
- Para personalizar los puertos del host, utiliza `CAPTAIN_HOST_HTTP_PORT`, `CAPTAIN_HOST_HTTPS_PORT` y `CAPTAIN_HOST_ADMIN_PORT`. Consulta [Variables de entorno del servidor](server-environment.md).
