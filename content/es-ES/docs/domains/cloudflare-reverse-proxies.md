---
id: cloudflare-reverse-proxies
title: Cloudflare y reverse proxies
slug: /domains/cloudflare-reverse-proxies
---

- Para instalar CapRover con Cloudflare DNS, apunta el registro A wildcard al servidor y selecciona **DNS only** (sin proxy de Cloudflare).
- Antes de solicitar certificados, comprueba que el dashboard y una aplicación de prueba funcionan mediante HTTP.
- Así, el desafío HTTP habitual puede llegar al NGINX de CapRover.

- Si después habilitas un proxy, comprueba el modo TLS, el header `Host` original, WebSocket, la caché y la ruta de renovación de certificados.
- Que el proxy termine HTTPS no garantiza que la conexión hasta CapRover esté cifrada.
- Una redirección o regla que impida que las peticiones públicas a `/.well-known/acme-challenge/` lleguen a CapRover puede interrumpir la emisión y renovación de certificados.

Si un reverse proxy externo ocupa los puertos 80 y 443 del host, consulta [Escenarios con reverse proxy](../installation/advanced/index.md). Prueba su configuración antes de forzar HTTPS en ambas capas.

## Cloudflare Universal SSL y subdominios anidados

En una configuración **full DNS** de Cloudflare, Universal SSL cubre `example.com` y los subdominios de primer nivel, como `apps.example.com`. **No** cubre automáticamente subdominios más profundos como `my-app.apps.example.com`.

- Si el dominio raíz de CapRover es `apps.example.com`, los dominios de las aplicaciones están dos niveles por debajo del apex.
- Utiliza **DNS only** y deja que CapRover gestione HTTPS en el origen, o configura [Total TLS / certificados avanzados de Cloudflare](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/) para esos nombres.
- En una configuración partial CNAME de Cloudflare, el comportamiento es diferente. Consulta sus reglas de cobertura de hostnames.

Comprueba por separado los certificados de Cloudflare edge y los certificados que CapRover emite en el origen.
