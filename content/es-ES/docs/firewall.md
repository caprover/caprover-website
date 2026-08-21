---
id: firewall
title: Firewall y reenvío de puertos
sidebar_label: Firewall y reenvío de puertos
---

## Puertos públicos

Exponga estos puertos a los usuarios:

- `80/tcp` para HTTP
- `443/tcp` para HTTPS
- `443/udp` para HTTP/3
- `3000/tcp` para la configuración inicial. Puede cerrarlo después de asociar CapRover a un dominio.

Para un servidor Ubuntu de un solo nodo que usa UFW:

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw allow 3000/tcp
```

El registro Docker de CapRover usa el puerto `996/tcp`. Expóngalo únicamente cuando un cliente externo necesite conectarse al registro autohospedado.

## Puertos del clúster

En un clúster de varios nodos, permita los siguientes puertos solamente entre nodos de Swarm de confianza:

- `2377/tcp` para el tráfico de administración de Swarm
- `7946/tcp` y `7946/udp` para la comunicación entre nodos
- `4789/udp` para el tráfico de la red superpuesta

Restrinja `4789/udp` a nodos de confianza. Exponer públicamente el puerto VXLAN puede dejar vulnerable la red superpuesta.

Si añade un mapeo de puertos a una aplicación, permita ese puerto en el firewall del proveedor cuando sea necesario. Los puertos publicados por Docker pueden eludir las reglas de UFW, así que use reglas compatibles con Docker cuando deba restringir el acceso. Consulte la documentación de Docker sobre [filtrado de paquetes y firewalls](https://docs.docker.com/engine/network/packet-filtering-firewalls/).

