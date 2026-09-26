---
id: environment-variables
title: Environment Variables
slug: /applications/environment-variables
---

Open an app's configuration in the dashboard and add key/value pairs under **Environment Variables**. Save the app settings and verify that the updated service starts successfully. Runtime code can read these variables, for example `process.env.DATABASE_URL` in Node.js.

Do not put passwords in a repository or a `captain-definition` file. Treat the dashboard and CapRover backups as sensitive because app configuration can contain secrets. Changing a variable updates the service's runtime configuration; an image rollback does not restore the previous values.

Build-time variables are a separate concern. When CapRover builds a Dockerfile, you can explicitly reference a supplied value with `ARG` and `ENV` if the build needs it:

```dockerfile
ARG PUBLIC_BUILD_VALUE
ENV PUBLIC_BUILD_VALUE=${PUBLIC_BUILD_VALUE}
```

CapRover also makes `CAPROVER_GIT_COMMIT_SHA` available during a source build. A build-time value can be embedded into the image, so avoid using this pattern for secrets. For deployed apps, inspect the resulting service configuration when troubleshooting variable changes.
