---
id: environment-variables
title: Environment Variables
slug: /applications/environment-variables
---

## Set runtime variables

1. Open your app in the dashboard.
2. Under **Environment Variables**, add the key/value pairs.
3. Save and verify that the service starts.

Example in Node.js: `process.env.DATABASE_URL`.

**Important:**

- Keep passwords out of the repository and `captain-definition` files.
- Protect dashboard access and backups. App configuration may contain secrets.
- Image rollback preserves the current runtime variables.

## Build-time variables

For Dockerfile builds, use `ARG` and `ENV` for nonsecret build values:

```dockerfile
ARG PUBLIC_BUILD_VALUE
ENV PUBLIC_BUILD_VALUE=${PUBLIC_BUILD_VALUE}
```

- CapRover provides `CAPROVER_GIT_COMMIT_SHA` during source builds.
- Build-time values may become part of the image. Keep secrets out.
- Inspect the deployed service configuration when debugging variable changes.
