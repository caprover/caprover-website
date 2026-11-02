---
id: index
title: Dominios y HTTPS
slug: /domains
---

<span id="source-domains-root-domain"></span>

## Dominio raíz y DNS wildcard

Dominio raíz de ejemplo: `apps.example.com`.

| Nombre | Registro | Resultado |
| --- | --- | --- |
| `*.apps` en la zona `example.com` | A → IPv4 del servidor | `captain.apps.example.com` y `my-app.apps.example.com` |
| `apps` (opcional) | A → IPv4 del servidor | `apps.example.com` sin subdominio adicional |

- Configura `apps.example.com` como dominio raíz de CapRover, sin `*.` ni `captain.`.
- Mantén el DNS wildcard apuntando a CapRover para los dominios de aplicaciones y la renovación de certificados.
- Si utilizas Cloudflare, elige **DNS only** durante la validación inicial de certificados HTTP-01. Consulta [Reverse proxies](cloudflare-reverse-proxies.md).

<span id="source-domains-app-domains"></span>

## Dominios de aplicaciones

- Dominio predeterminado de una aplicación: `<app-name>.<root-domain>`.
- Configura **Container HTTP Port** con el puerto en el que escucha tu aplicación. El proceso debe escuchar en `0.0.0.0`.
- Los workers y las bases de datos que son servicios privados no necesitan un dominio público.

<span id="source-domains-custom-domains"></span>

## Dominios personalizados

- Apunta el hostname al servidor CapRover y después asígnalo a la aplicación.
- Para dominios apex, utiliza un registro A o el mecanismo de alias compatible con tu proveedor DNS.
- Las redirecciones y la renovación de certificados dependen de que el hostname original siga resolviendo a CapRover.

<span id="source-domains-https"></span>

## HTTPS

CapRover utiliza Certbot para emitir certificados para cada hostname del dashboard y de las aplicaciones.

**Requisitos de los certificados:**

- El hostname resuelve al servidor correcto.
- El puerto público `80/tcp` permite completar el desafío HTTP-01.
- El puerto `443/tcp` está abierto para HTTPS.

Un registro DNS wildcard **no** genera un certificado TLS wildcard. Cada hostname necesita su propio tratamiento de certificados.

Si utilizas un reverse proxy externo, permite que las peticiones HTTP-01 lleguen a CapRover o configura otro método de validación mediante [Certbot / ACME avanzado](advanced-certbot.md).

<span id="source-domains-certificate-renewal"></span>

## Renovación de certificados

- Conserva el DNS y la ruta del desafío HTTP-01 después de modificar proxies, firewall o servidores.
- Si falla la renovación, revisa `docker service logs captain-captain --since 24h` y el DNS del hostname afectado.
- Los certificados huérfanos pueden generar avisos. Las versiones recientes de CapRover intentan eliminar certificados que ya no están asignados a ningún dominio si llevan al menos 24 horas caducados. Comprueba el comportamiento en tu versión antes de intervenir.
- Conserva los certificados de dominios activos y resuelve la causa de los fallos de renovación.
