---
id: static-react
title: Implementar una aplicación estática / React
slug: /guides/static-react
---

- Construya su React u otro sitio estático localmente y sirva los archivos compilados de una pequeña imagen NGINX.
- Esto mantiene dependencias de tiempo de construcción fuera del anfitrión CapRover.
- El ejemplo utiliza un estilo Vite `dist` directorio; reemplazarlo por `build` si eso es lo que produce su proyecto.

1. Corre `npm ci && npm run build` en su proyecto. Mira eso. `dist/index.html` existe.
2. Crear un `Dockerfile` en la raíz del proyecto:

   ```dockerfile
   FROM nginx:stable-alpine
   COPY dist/ /usr/share/nginx/html/
   ```

3. Crear un archivo llamado `captain-definition` junto con él que contiene `{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}`.
4. Paquete el Dockerfile, definición, y **Producción construida** de la raíz del proyecto, luego desplegar el archivo:

   ```bash
   tar -cf deploy.tar captain-definition Dockerfile dist
   caprover deploy --tarFile ./deploy.tar
   ```

   Crear la aplicación web CapRover primero, y seleccionarla cuando el CLI le indique. Puedes subir `deploy.tar` de su **Despliegue** tab. Establecer el puerto HTTP contenedor `80`.
5. Visite la dirección HTTP de la aplicación, a continuación, active HTTPS y verifique el dominio público. Recompilar y reempaquetar la salida para cada nuevo despliegue.

- El CLI ordinario Usos de despliegue de Git `git archive` omite archivos no comprometidos o ignorados por Git.
- Puesto que la salida compilada se ignora comúnmente, utilice el flujo de trabajo de tarta por encima en lugar de `caprover deploy` sin `--tarFile`.

Para rutas cliente-side tales como `/settings`, poner lo siguiente en `nginx.conf` en la raíz del proyecto para que un navegador refresca la aplicación:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
```

Añadir `COPY nginx.conf /etc/nginx/conf.d/default.conf` al Dockerfile, luego incluir `nginx.conf` en el `tar -cf` comando arriba. Reconstruir y redistribuir. No ponga secretos privados en variables de tiempo de construcción: compilado JavaScript es público. Si la aplicación tiene una API, implementarla por separado y apuntar el frontend a su URL HTTPS.
