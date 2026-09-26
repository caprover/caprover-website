---
id: static-react
title: Deploy a Static / React App
slug: /guides/static-react
---

Build your React or other static site locally and serve the compiled files from a small NGINX image. This keeps build-time dependencies off the CapRover host.

1. Run `npm ci && npm run build` in your project. Adjust `dist` below if your tool produces a different output directory.
2. Create a `Dockerfile` in the project root:

   ```dockerfile
   FROM nginx:stable-alpine
   COPY dist/ /usr/share/nginx/html/
   ```

3. Create a `captain-definition` alongside it: `{"schemaVersion":2,"dockerfilePath":"./Dockerfile"}`.
4. Create a CapRover web app. Deploy the project using [the CLI](../deployments/cli.md) or upload an archive containing the Dockerfile, definition, and built `dist` directory. Set the container HTTP port to `80`.
5. Visit the app's HTTP address, then enable HTTPS and verify the public domain.

For client-side routes such as `/settings`, configure NGINX to fall back to `/index.html`; otherwise a browser refresh may return 404. Do not put private secrets in build-time variables: compiled JavaScript is public. If the app has an API, deploy it separately and point the frontend to its HTTPS URL.
