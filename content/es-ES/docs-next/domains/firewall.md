---
id: firewall
title: Firewall
slug: /domains/firewall
---

| Puerto | Acceso |
| --- | --- |
| `80/tcp` | HTTP público y validación de certificados |
| `443/tcp` | HTTPS públicos |
| `3000/tcp` | Configuración inicial del panel de control; restringir después de HTTPS |
| `996/tcp` | Registro auto hospedado, cuando esté habilitado |
| `2377/tcp` | Gestión del cisma entre los nodos de confianza |
| `7946/tcp,udp` | Comunicación de los nodos de Swarm |
| `4789/udp` | Redes de superposición de Swarm |

- Permitir SSH antes de habilitar UFW. El firewall de su proveedor de alojamiento también debe permitir el tráfico requerido.
- Restrict Swarm ports to cluster nodes.
- Los puertos docker-publicados pueden pasar por alto las reglas UFW. Use el proveedor o las reglas del cortafuegos de Docker.

See [Comienzo](../get-started.md) y [Referencia del puerto](../reference/ports.md).

<span id="source-domains-public-services"></span>
<span id="source-applications-public-ports"></span>

## Puertos públicos TCP / UDP

- Publicar puertos de aplicación sólo para clientes fuera de la red Docker de CapRover.
- Especifique el puerto de contenedores, el puerto anfitrión y el protocolo en la configuración de la aplicación.
- Docker Swarm `ingress` rutas de modo a través de los nodos; `host` El modo publica en el nodo que ejecuta la tarea.
- Protege bases de datos expuestas con autenticación y acceso restringido a la red.

<span id="source-domains-internal-networking"></span>

## Redes internas

Las aplicaciones en la red de superposición de CapRover pueden conectarse usando el nombre de servicio de destino y el puerto, como `database:5432`, sin publicar un puerto host. Compruebe el nombre real con `docker service ls`; los servicios heredados pueden conservar `srv-captain--` Prefijo.
