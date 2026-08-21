---
id: zero-downtime
title: Zero Downtime Deployments
sidebar_label: Zero Downtime
---

#### Example:

If you prefer to learn from an example, see [this github repository](https://github.com/caprover/zero-downtime-example).

This repo contains an example app that takes 15sec to start up. But, when deploying this app on any CapRover instance, you will not see any 502 errors.

Keep in mind that you need to ensure that, when creating an app, you **DO NOT** check the "persistent data" checkbox.

### Understanding the Challenge

During the deployment process, when a new Docker image is being rolled out, there might be a temporary service disruption (502 error during deployment). This usually occurs because the new container can take some time (e.g., 30 seconds) to become fully operational. During this time, if the service receives traffic, Nginx might return a 502 Bad Gateway error, indicating that it cannot receive a response from the backend service.

### The Role of Docker Health Checks

Docker health checks are a vital feature that helps mitigate deployment-induced downtime. They allow you to specify a command in a Dockerfile for periodically checking the health of a container. Docker then uses this information to manage the lifecycle of the container based on its state.

### Implementing Health Checks in CapRover

To integrate health checks into your CapRover deployment process, follow these steps:

**Step 1:** Define the Health Check in Your Dockerfile
Modify your Dockerfile to include a `HEALTHCHECK` instruction. This instruction tells Docker how to test the container to check if it is still working. This can be a command that checks the internal state of the container or makes a request to a HTTP endpoint.

```dockerfile
HEALTHCHECK --interval=30s --timeout=30s --retries=3 \
 CMD curl -f http://127.0.0.1:3000/ || exit 1
```

In this example, curl will request the root URL of the container every 30 seconds. If curl exits with a non-zero status more than three times in a row (as defined by
`--retries`), the container is considered unhealthy.

**Step 2:** Deploy and Configure in CapRover
Once your Dockerfile is updated, deploy your application via CapRover. The platform, which uses Docker Swarm, will recognize the health check instructions and manage the deployment accordingly.

CapRover's default behavior, with Docker Swarm, will wait for the new container to pass its health check before routing traffic to it. This effectively avoids routing requests to containers that are not ready to handle them, thereby preventing 502 errors.

### When does it not work?

If your app doesn't use a volume, CapRover uses `start-first` strategy when updating the containers. This means that the new version of your container will be up and running before the old one is killed. This should give you next-to-zero downtime.

This strategy is intentionally not applied to apps with volumes attached to them. This is because if multiple instances of the same service are trying to access the same file, this will result in data corruption and failures. For apps with volumes (**persistent data**), CapRover user `stop-first` strategy. This means that the old container is stopped first, before the new container starts up. This results in some amount of downtime.

If your app has persistent data, you can still force the `start-first` strategy, but keep in mind that if might cause data corruption as the old and new container might try to write the same file at the same time. If you still want to proceed with this, you can simply enter this in your [service override](service-update-override.md)

```yaml
UpdateConfig:
  Parallelism: 2
  Delay: 1000000000
  FailureAction: pause
  Monitor: 15000000000
  MaxFailureRatio: 0.15
  Order: start-first
```
