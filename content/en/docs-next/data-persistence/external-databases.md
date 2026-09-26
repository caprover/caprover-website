---
id: external-databases
title: Connect to Databases Externally
slug: /data-persistence/external-databases
---

Use an internal service connection when the client also runs on CapRover. For an external client, decide whether a restricted published port or a tunnel is appropriate before exposing a database to the internet.

## Prepare the database

Deploy the database as a persistent, non-web app. Configure its data volume or bind mount, credentials, and database name. Verify it is ready in its service logs and that a CapRover app can reach it internally by app name and container port. Back up the database data separately from the CapRover configuration.

## Publish a restricted port

In the database app's **App Config**, map a chosen host port, for example `12345/tcp`, to the database container's port, for example PostgreSQL `5432/tcp`. Save and verify the service update. From your client, connect to `SERVER_PUBLIC_IP:12345` with the database username and password.

Allow inbound `12345/tcp` in your hosting provider's firewall **only from the client addresses that need it**. Review host rules as well: Docker-published ports can bypass ordinary UFW restrictions. In a cluster, choose ingress or host publish mode deliberately and verify which node answers the port. Use the database protocol's TLS and strong authentication when the traffic crosses an untrusted network; a port mapping alone does not encrypt it.

## Prefer a private path when possible

A VPN or a tunnel into a service on CapRover's overlay network avoids a broadly published database port. Host SSH alone does not necessarily resolve or reach an app's internal Docker service name. A tunnel endpoint must have connectivity to that overlay network; verify its placement and access controls before relying on it.

After either method works, test from the intended external client, remove temporary broad firewall rules, and document the port, allowed clients, credentials owner, backup, and shutdown plan.
