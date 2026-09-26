---
id: applications-and-services
title: Applications and Docker Services
slug: /fundamentals/applications-and-services
---

A CapRover **app** is a managed Docker Swarm service. Its name identifies the service and normally gives it a default subdomain under your root domain. CapRover records the app's settings and deployment history; Docker runs the containers.

The app's **instance count** tells Swarm how many service tasks to run. A web app can receive HTTP traffic through CapRover's NGINX. A non-web app can run background jobs or expose a separate TCP/UDP port without an HTTP route. An app with node-local persistent data needs placement that keeps it on the node with that data.

Creating an app and deploying an image are separate steps. A newly created app can exist before the intended image is deployed. See [Create and Manage Apps](../applications/create-manage.md) and [Scale an Application](../scaling/scale-app.md).
