---
id: cloudflare-reverse-proxies
title: Cloudflare y Proxies Inversos
slug: /domains/cloudflare-reverse-proxies
---

- Para la configuración inicial con Cloudflare DNS, puntee la tarjeta salvaje Un registro al servidor CapRover y elija **DNS only** (sin proxy Cloudflare).
- Confirme el dashboard y muestre el trabajo de la aplicación sobre HTTP antes de solicitar certificados.
- Esto permite que el desafío HTTP normal de CapRover alcance su propio servicio NGINX.

- Si luego enciende un proxy, verifique su modo TLS, original `Host` cabecera, manejo WebSocket, comportamiento de caché y ruta de renovación de certificados.
- Un proxy terminando HTTPS no encripta automáticamente la conexión con CapRover.
- Una norma de redirección o desafío que impide las solicitudes públicas `/.well-known/acme-challenge/` de llegar a CapRover puede romper la emisión o renovación.

Para un proxy inverso que posee puertos host 80 y 443, vea [Escenarios Proxy inversos](../installation/advanced/index.md)Configurar y probar el comportamiento exacto del proxy antes de habilitar HTTPS forzado en ambas capas.

## Cloudflare Universal SSL y dominios de aplicaciones anidados

En un Cloudflare **Full DNS setup**, Cubiertas universales SSL `example.com` y subdominios de primer nivel, como `apps.example.com`. **no** cubrir los nombres de host más profundos, como `my-app.apps.example.com`.

- Si su dominio raíz CapRover es `apps.example.com`, subdominios de aplicaciones proxiados son dos niveles de profundidad.
- Uso **DNS only** y dejar CapRover manejar HTTPS en el origen, o configurar Cloudflare [Total TLS / certificados avanzados](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/) para los nombres más profundos.
- En una configuración de CNAME parcial de Cloudflare, el comportamiento del certificado difiere; siga las reglas de cobertura de Cloudflare.

Chequee certificados de borde Cloudflare por separado de los certificados Problemas CapRover para el origen.
