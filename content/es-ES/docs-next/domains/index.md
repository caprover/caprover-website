---
id: index
title: Dominios &quot; HTTPS
slug: /domains
---

<span id="source-domains-root-domain"></span>

## Dominio de raíz y comodín DNS

Ejemplo de dominio raíz: `apps.example.com`.

| Nombre | Record | Resultado |
| --- | --- | --- |
| `*.apps` en el `example.com` Zona | A → servidor IPv4 | `captain.apps.example.com` y `my-app.apps.example.com` |
| `apps` (opcional) | A → servidor IPv4 | Bare `apps.example.com` |

- Entra `apps.example.com` como dominio raíz de CapRover, sin `*.` o `captain.`.
- Mantenga Wildcard DNS apuntando a CapRover para dominios de aplicaciones y renovación de certificados.
- Detrás de Cloudflare, uso **DNS only** durante la validación inicial del certificado HTTP-01. See [Proxies inversos](cloudflare-reverse-proxies.md).

<span id="source-domains-app-domains"></span>

## Dominios de aplicación

- Dominio de aplicación predeterminado: `<app-name>.<root-domain>`.
- Set **Container HTTP Port** al puerto de escucha de tu app. La aplicación debe unirse a `0.0.0.0`.
- Los trabajadores y bases de datos que son servicios privados no necesitan dominio público.

<span id="source-domains-custom-domains"></span>

## Dominios personalizados

- Apunte el nombre de host al servidor CapRover, y luego adjuntelo a la aplicación.
- Para dominios apex, utilice un registro A o un mecanismo de alias compatible con un proveedor DNS.
- Las redirecciones de dominio y la renovación de certificados dependen del nombre de host fuente que sigue resuelto a CapRover.

<span id="source-domains-https"></span>

## HTTPS

CapRover utiliza Certbot para emitir certificados para el dashboard individual y los nombres de host de aplicaciones.

**Requisitos del certificado:**

- El nombre de host se resuelve al servidor correcto.
- Público `80/tcp` alcanza CapRover para el desafío HTTP-01.
- `443/tcp` está abierto para HTTPS.

Wildcard DNS **no** crear un certificado TLS salvaje. Cada nombre de host necesita un tratamiento adecuado de certificados.

Detrás de un proxy reverso externo, pasar solicitudes de validación HTTP-01 a CapRover o configurar un desafío alternativo a través de [Certbot avanzado / ACME](advanced-certbot.md).

<span id="source-domains-certificate-renewal"></span>

## Renovación de certificados

- Mantenga DNS y la ruta de desafío HTTP-01 trabajando después de cambios proxy, firewall y servidor.
- Por fallas, inspeccionar `docker service logs captain-captain --since 24h` y el DNS del nombre de host afectado.
- Los viejos certificados no registrados pueden generar advertencias. Las versiones recientes de CapRover intentan eliminar certificados huérfanos después de haber sido vencidos por al menos 24 horas. Confirme contra su versión instalada antes de intervenir.
- Preserve certificados utilizados por dominios activos; fijar fallas de renovación en su fuente.
