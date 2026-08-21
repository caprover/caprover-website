---
id: docker-compose
title: Docker Compose
sidebar_label: Docker Compose
---

CapRover can deploy a supported subset of Docker Compose directly from the dashboard. This feature is useful for creating several related apps together, but it is still experimental and does not implement the complete Compose specification.

## Deploy a Compose file

1. Open **Apps** in the CapRover dashboard.
2. Select **Docker Compose**.
3. Paste your Compose YAML into the editor.
4. Review the generated apps, then deploy.

For example:

```yaml
services:
  db:
    image: mysql:8.4
    volumes:
      - db-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: change-this-password
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: change-this-password

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: change-this-password
      WORDPRESS_DB_NAME: wordpress
```

Services in the same deployment can reach one another by service name, such as `db:3306` in this example. Apps created by current CapRover versions use their app name as the Docker service name. Apps upgraded from releases before 1.15 may retain a physical service name such as `srv-captain--db`; CapRover keeps the prefixed network alias for compatibility.

## Supported fields

The current parser supports these service fields:

- `image`
- `environment`
- `ports`
- `volumes`
- `depends_on`
- `hostname`
- `cap_add`
- `command`

Other Compose fields are ignored. In particular, check files that rely on `build`, `container_name`, custom `networks`, `secrets`, `configs`, `deploy`, or `restart`. Configure the equivalent behavior in the generated app's CapRover settings where available.

Named volumes referenced by a service are created and managed by CapRover. Compose `ports` entries must use the `HOST:CONTAINER` form. Review each generated app after deployment to confirm its HTTP port, persistent directories, port mappings, environment variables, and dependencies.

## Running Compose outside CapRover

If your stack requires unsupported Compose features, you can manage it directly with `docker compose`. To make one of those services reachable from a CapRover app, attach it to the external `captain-overlay-network`:

```yaml
services:
  web-app:
    image: your-image:latest
    networks:
      - captain-overlay-network

networks:
  captain-overlay-network:
    external: true
```

You can then create a CapRover **Nginx Reverse Proxy** app with an upstream such as `http://web-app`. Services started directly with Docker Compose remain outside CapRover's deployment, scaling, backup, and lifecycle management.
