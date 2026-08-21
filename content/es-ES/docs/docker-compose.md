---
id: docker-compose
title: Docker Compose
sidebar_label: Docker Compose
---

## IMPORTANTE:

Si le interesa el soporte Docker Compose, deje una nota en [este número](https://github.com/caprover/caprover/issues/2175)

## ¿Qué es Docker Compose?

Para los novatos de Docker, muchos ejemplos que encontrará en Internet son Docker Compose. Por ejemplo, este es un Docker Compose simple para WordPress:

```yaml
version: '3.3'

services:
   db:
     image: mysql:5.7
     volumes:
       - db-data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: somewordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: db:3306
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: wordpress
       WORDPRESS_DB_NAME: wordpress
volumes:
    db-data: {}
```

Se explica por sí mismo. Define uno o varios servicios (aplicaciones) y sus configuraciones, como volúmenes persistentes, puertos mapeados, variables de entorno, etc. Docker componer es una forma realmente fácil y legible de definir un conjunto de aplicaciones que deben trabajar juntas. Por lo general, para ejecutar un archivo de redacción de Docker, debe ejecutar algo como:
```
docker-compose -f my-docker-compose.yml up
```


## Relación con CapRover - Malo

CapRover es solo una capa delgada alrededor de Docker. Utiliza Docker para crear y ejecutar sus aplicaciones. Hace todo esto a través de [Docker API](https://docs.docker.com/reference/api/engine/version/v1.43/).

Aunque Docker Compose es una función en Docker CLI, NO está disponible en Docker API. Esto significa que CapRover no puede manejar archivos de redacción de Docker.


## Relación con CapRover - Buena

Dicho esto, CapRover tiene un sistema incorporado para analizar docker-compose (parcialmente) y lo convierte en partes que Docker API entiende. De hecho, así es exactamente como funcionan las CapRover aplicaciones de un clic. Las aplicaciones de un clic son solo una variante con plantilla de archivos Docker Compose. Por ejemplo, esta es la aplicación de un clic para WordPress:

```yaml
captainVersion: 4
services:
    $$cap_appname-db:
        image: $$cap_db_type:$$cap_database_version
        volumes:
            - $$cap_appname-db-data:/var/lib/mysql
        restart: always
        environment:
            MYSQL_ROOT_PASSWORD: $$cap_db_pass
            MYSQL_DATABASE: wordpress
            MYSQL_USER: $$cap_db_user
            MYSQL_PASSWORD: $$cap_db_pass
        caproverExtra:
            notExposeAsWebApp: 'true'
    $$cap_appname-wordpress:
        depends_on:
            - $$cap_appname-db
        image: wordpress:$$cap_wp_version
        volumes:
            - $$cap_appname-wp-data:/var/www/html
        restart: always
        environment:
            WORDPRESS_DB_HOST: srv-captain--$$cap_appname-db:3306
            WORDPRESS_DB_USER: $$cap_db_user
            WORDPRESS_DB_PASSWORD: $$cap_db_pass
caproverOneClickApp:
    variables:
        - id: $$cap_db_user
          label: Database user
          defaultValue: wordpressuser
          validRegex: /^([a-zA-Z0-9])+$/
        - id: $$cap_db_pass
          label: Database password
          description: ''
          validRegex: /.{1,}/
        - id: $$cap_wp_version
          label: WordPress Version
          defaultValue: '4.9'
          description: Check out their Docker page for the valid tags https://hub.docker.com/r/library/wordpress/tags/
          validRegex: /^([^\s^\/])+$/
        - id: $$cap_db_type
          label: Database Type
          defaultValue: mysql
          description: You can either choose mariadb or mysql, you need to change the version according to which DB is selected. It is case sensitive.
          validRegex: /^(mysql|mariadb)$/
        - id: $$cap_database_version
          label: Database Version, default is MySQL
          defaultValue: '5.7'
          description: Check out the Docker pages for the valid tags https://hub.docker.com/r/library/mysql/tags/ or https://hub.docker.com/_/mariadb?tab=tags
          validRegex: /^([^\s^\/])+$/
    instructions:
        start: >-
            WordPress is an online, open source website creation tool written in PHP. But in non-geek speak, it’s probably the easiest and most powerful blogging and website content management system (or CMS) in existence today.
             Enter your WordPress Configuration parameters and click on next. A MySQL (database) and a WordPress container will be created for you.  The process will take about a minute for the process to finish.
        end: >
            Wordpress is deployed and available as $$cap_appname-wordpress . 
             IMPORTANT: It will take up to 2 minutes for WordPress to be ready. Before that, you might see a 502 error page.
    displayName: WordPress
    isOfficial: true
    description: WordPress is a content management system based on PHP and MySQL that is usually used with the MySQL or MariaDB database
    documentation: Taken from https://docs.docker.com/compose/wordpress/. Port mapping removed from WP as it is no longer needed
```

Como puedes ver, ¡la parte superior es muy similar a un Docker Compose!


## Cómo ejecutar Docker Compose en CapRover


Tenga en cuenta que, como se mencionó anteriormente, el analizador integrado no admite todos los campos que están disponibles en Docker Compose. Específicamente, solo admite: `image`, `environment`, `ports`, `volumes`, `depends_on` y `hostname`; CapRover ignora actualmente otros parámetros.

Suponiendo que su Docker Compose no tiene ninguno de estos parámetros, o que no son cruciales para su aplicación, simplemente puede ejecutar Docker Compose mediante

1) Navega a Aplicaciones

2) Haga clic en "One Click Apps/Bases de datos"

3) Navegue hasta el final de la lista y haga clic en el último elemento, llamado `>> TEMPLATE <<`

4) Copie la siguiente sección en el cuadro:


```yaml
captainVersion: 4
caproverOneClickApp:
    instructions:
        start: Just a plain Docker Compose.
        end: Docker Compose is deployed.
########
```

5) Después de `########`, copia todo el contenido de tu Docker Compose. Tenga en cuenta que sus servicios tendrán el prefijo `srv-captain--` cuando se implementen a través de CapRover. Por lo tanto, haga cambios si es necesario. Por ejemplo, la composición completa de la ventana acoplable de WordPress se verá así en CapRover


```yaml
captainVersion: 4
caproverOneClickApp:
    instructions:
        start: Just a plain Docker Compose.
        end: Docker Compose is deployed.
########
version: '3.3'

services:
   db:
     image: mysql:5.7
     volumes:
       - db-data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: somewordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: srv-captain--db:3306 ## NOTICE it is changed to "srv-captain--db" from "db"
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: wordpress
       WORDPRESS_DB_NAME: wordpress
volumes:
    db-data: {}
```

## Servicio con CAP_ADD Bandera

Si está trabajando en un contenedor como OpenVPN, a menudo requieren un indicador acoplable cap_add especial. Puedes agregarlos así:

```yaml
captainVersion: 4
services:
    openvpn:
        caproverExtra:
            containerHttpPort: 943
        image: linuxserver/openvpn-as:2.9.0-5c5bd120-Ubuntu18-ls124
        environment:
            PUID: 1000
            PGID: 1000
            TZ: UTC
            INTERFACE: ""
        volumes:
            - openvpn:/config
        ports:
            - 9443:9443
            - 1194:1194
        cap_add:
            - NET_ADMIN
caproverOneClickApp:
    displayName: OpenVPN Access Server
    isOfficial: false
    description: Full featured secure network tunneling VPN software.
    documentation: https://openvpn.net/index.php/access-server/overview.html
    instructions:
      start: Just a openvpn Docker Compose with cap_add.
      end: Docker Compose is deployed.
```


## Enfoque alternativo

Si no puedes hacerlo funcionar con una plantilla de aplicación de un solo clic, ¡hay otra opción! Simplemente puede ejecutar Docker Compose puro descargando el archivo de redacción y ejecutando `docker compose up`. Pero antes de eso, simplemente agregue `captain-overlay-network` a la sección de su aplicación web de su archivo Docker Compose yaml:
```
  web-app:
    image: .....
    container_name: ......
    networks:
      - captain-overlay-network

networks:
  captain-overlay-network:
    external: true
```

Ahora, en lugar de la posible asignación de puertos que podría tener, como `8080:80`, puede simplemente crear una aplicación CapRover "Nginx Reverse Proxy" y usar el nombre de su contenedor como proxy ascendente, como `http://web-app`, ¡y listo!

