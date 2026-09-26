---
id: how-caprover-works
title: How CapRover Works
slug: /fundamentals/how-caprover-works
---

CapRover runs on Docker Swarm. The CapRover service stores configuration, the dashboard manages applications, and its NGINX service routes web requests to application services. Docker keeps each service at its requested replica count.

For a web app, the usual request path is: DNS resolves the hostname to your server, CapRover's NGINX accepts the HTTP or HTTPS request, and NGINX forwards it to the app's Docker service and container HTTP port. Non-web apps can run without a public HTTP route.

When you deploy, CapRover builds an image from source or pulls a specified image, then updates the Docker service. CapRover's settings describe the app's domains, environment variables, ports, volumes, instance count, and placement. The app's own code and data have separate lifecycles; a new image does not automatically back up a database or shared files.

Start with [Getting Started](../get-started.md), then explore [Applications](../applications/index.md), [Deployments](../deployments/index.md), and [Data & Persistence](../data-persistence/index.md).
