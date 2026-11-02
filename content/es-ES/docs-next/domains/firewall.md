---
id: firewall
title: Firewall
slug: /domains/firewall
---

| Puerto | Uso |
| --- | --- |
| `80/tcp` | HTTP público y validación de certificados |
| `443/tcp` | HTTPS público |
| `3000/tcp` | Configuración inicial del dashboard; restringir tras activar HTTPS |
| `996/tcp` | Registry autohospedado, si está habilitado |
| `2377/tcp` | Administración de Swarm entre nodos de confianza |
| `7946/tcp,udp` | Comunicación entre nodos de Swarm |
| `4789/udp` | Red overlay de Swarm |

- Permite SSH antes de habilitar UFW. También debes abrir los puertos necesarios en el firewall de tu proveedor.
- Restringe los puertos de Swarm a los nodos del clúster.
- Los puertos publicados por Docker pueden eludir las reglas habituales de UFW. Utiliza reglas del proveedor o un firewall compatible con Docker.

Consulta [Primeros pasos](../get-started.md) y [Referencia de puertos](../reference/ports.md).

<span id="source-domains-public-services"></span>
<span id="source-applications-public-ports"></span>

## Puertos TCP/UDP públicos

- Publica puertos de las aplicaciones solo cuando deban acceder clientes externos a la red Docker de CapRover.
- En los ajustes de la aplicación, especifica el puerto del contenedor, el puerto del host y el protocolo.
- En Docker Swarm, el modo `ingress` enruta tráfico entre nodos; el modo `host` publica el puerto en el nodo donde se ejecuta la tarea.
- Protege las bases de datos expuestas mediante autenticación y restricciones de red.

<span id="source-domains-internal-networking"></span>

## Red interna

Las aplicaciones conectadas a la red overlay de CapRover pueden acceder a otros servicios usando el nombre y el puerto, por ejemplo `database:5432`, sin publicar puertos del host. Comprueba el nombre real con `docker service ls`; los servicios antiguos pueden mantener el prefijo `srv-captain--`.
