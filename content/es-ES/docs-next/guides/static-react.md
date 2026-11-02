---
id: static-react
title: Desplegar una aplicación estática o React
slug: /guides/static-react
---

- Compila tu aplicación React u otro sitio estático localmente y sirve los archivos resultantes desde una imagen NGINX ligera.
- Así evitas instalar las dependencias de build en el host CapRover.
- Este ejemplo usa el directorio `dist` habitual de Vite; sustitúyelo por `build` si es el directorio de salida de tu proyecto.

1. Ejecuta `npm ci && npm run build` en el proyecto. Comprueba que existe `dist/index.html`.
2. Crea un `Dockerfile` en la raíz:

   ```dockerfile
   FROM nginx:stable-alpine
   COPY dist/ /usr/share/nginx/html/
   ```

3. Crea un archivo `captain-definition` en el mismo directorio con `{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}`.
4. Empaqueta el Dockerfile, la definición y los **archivos compilados** y despliega el tar:

   ```bash
   tar -cf deploy.tar captain-definition Dockerfile dist
   caprover deploy --tarFile ./deploy.tar
   ```

   Antes debes crear la aplicación web en CapRover y seleccionarla cuando lo pida la CLI. También puedes subir `deploy.tar` desde la pestaña **Deployment**. Configura el puerto HTTP del contenedor en `80`.
5. Abre la dirección HTTP de la aplicación, activa HTTPS y comprueba el dominio público. En cada nuevo despliegue debes volver a compilar y empaquetar.

- El despliegue Git de la CLI utiliza `git archive` y excluye archivos sin commit o ignorados por Git.
- Como los archivos compilados suelen ignorarse, elige el método tar anterior; ejecutar directamente `caprover deploy` sin `--tarFile` podría omitirlos.

Para soportar rutas del frontend como `/settings`, añade el siguiente archivo `nginx.conf` en la raíz del proyecto, para que el navegador cargue la aplicación al refrescar:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
```

Añade `COPY nginx.conf /etc/nginx/conf.d/default.conf` al Dockerfile e incluye `nginx.conf` en el comando `tar -cf` anterior. Vuelve a compilar y desplegar. No pongas secretos en variables de build: el JavaScript compilado es público. Si tu aplicación utiliza una API, despliega el backend por separado y configura su URL HTTPS en el frontend.
