---
id: static-react
title: Deploy a Static / React App
slug: /guides/static-react
---

Build your React or other static site locally and serve the compiled files from a small NGINX image. This keeps build-time dependencies off the CapRover host. The example uses a Vite-style `dist` directory; replace it with `build` if that is what your project produces.

1. Run `npm ci && npm run build` in your project. Check that `dist/index.html` exists.
2. Create a `Dockerfile` in the project root:

   ```dockerfile
   FROM nginx:stable-alpine
   COPY dist/ /usr/share/nginx/html/
   ```

3. Create a file named `captain-definition` alongside it containing `{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}`.
4. Package the Dockerfile, definition, and **built output** from the project root, then deploy the archive:

   ```bash
   tar -cf deploy.tar captain-definition Dockerfile dist
   caprover deploy --tarFile ./deploy.tar
   ```

   Create the CapRover web app first, and select it when the CLI prompts you. You can instead upload `deploy.tar` from its **Deployment** tab. Set the container HTTP port to `80`.
5. Visit the app's HTTP address, then enable HTTPS and verify the public domain. Rebuild and repackage the output for each new deployment.

The ordinary CLI Git deployment uses `git archive` and omits uncommitted or Git-ignored files. Since compiled output is commonly ignored, use the tar workflow above instead of `caprover deploy` without `--tarFile`.

For client-side routes such as `/settings`, put the following in `nginx.conf` at the project root so a browser refresh loads the app:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
```

Add `COPY nginx.conf /etc/nginx/conf.d/default.conf` to the Dockerfile, then include `nginx.conf` in the `tar -cf` command above. Rebuild and redeploy. Do not put private secrets in build-time variables: compiled JavaScript is public. If the app has an API, deploy it separately and point the frontend to its HTTPS URL.
