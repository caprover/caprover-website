---
id: pre-deploy-function
title: Pre-Deploy Function
slug: /applications/advanced/pre-deploy-function
---

A **Pre-Deploy Function** is JavaScript executed inside the CapRover process before an app's Docker service update. It can inspect the stored app object and modify the service update object. It runs after the standard app settings and Service Update Override have been applied.

```javascript
var preDeployFunction = function (captainAppObj, dockerUpdateObject) {
  return Promise.resolve(dockerUpdateObject);
};
```

The function must return the service update object, possibly through a promise. It executes again on deployments and configuration updates. Test it against a disposable app before using it for important services, and preserve a working copy of the function and service configuration.

This code has the privileges of the CapRover process. It can break service updates or access sensitive data, so restrict who can edit it. For static service fields, prefer a [Service Update Override](./service-update-override.md). Check `docker service logs captain-captain` if a service update fails before reaching Docker.
