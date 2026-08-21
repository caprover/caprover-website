---
id: docker-compose
title: Docker Compose
sidebar_label: Docker Compose
---

CapRover puede desplegar directamente desde el panel un subconjunto compatible de Docker Compose. Esta función resulta útil para crear varias aplicaciones relacionadas, pero sigue siendo experimental y no implementa toda la especificación de Compose.

## Desplegar un archivo Compose

1. Abra **Apps** en el panel de CapRover.
2. Seleccione **Docker Compose**.
3. Pegue el YAML de Compose en el editor.
4. Revise las aplicaciones generadas y ejecute el despliegue.

Por ejemplo:

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

Los servicios del mismo despliegue pueden comunicarse mediante el nombre del servicio, como `db:3306` en este ejemplo. Las aplicaciones creadas por versiones actuales de CapRover usan el nombre de la aplicación como nombre del servicio de Docker. Las aplicaciones actualizadas desde versiones anteriores a 1.15 pueden conservar un nombre físico como `srv-captain--db`; CapRover mantiene el alias de red con prefijo por compatibilidad.

## Campos compatibles

El analizador actual admite estos campos de servicio:

- `image`
- `environment`
- `ports`
- `volumes`
- `depends_on`
- `hostname`
- `cap_add`
- `command`

Los demás campos de Compose se ignoran. Revise especialmente los archivos que dependan de `build`, `container_name`, redes personalizadas mediante `networks`, `secrets`, `configs`, `deploy` o `restart`. Configure el comportamiento equivalente en los ajustes de la aplicación generada cuando esté disponible.

CapRover crea y administra los volúmenes con nombre que usa cada servicio. Las entradas de Compose en `ports` deben usar el formato `HOST:CONTENEDOR`. Después del despliegue, revise cada aplicación generada para confirmar su puerto HTTP, directorios persistentes, mapeos de puertos, variables de entorno y dependencias.

## Ejecutar Compose fuera de CapRover

Si su conjunto de servicios requiere funciones de Compose no compatibles, puede administrarlo directamente con `docker compose`. Para que un servicio sea accesible desde una aplicación de CapRover, conéctelo a la red externa `captain-overlay-network`:

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

A continuación puede crear una aplicación **Nginx Reverse Proxy** en CapRover con un destino como `http://web-app`. Los servicios iniciados directamente con Docker Compose quedan fuera de la gestión de despliegues, escalado, copias de seguridad y ciclo de vida de CapRover.
