---
id: deploy-databases
title: Desplegar bases de datos
slug: /data-persistence/deploy-databases
---

- Puedes instalar una base de datos mediante el catálogo de [One-Click Apps](../one-click-apps/index.md) o desplegar directamente una imagen compatible.

1. Elige el motor y la versión de la imagen. Crea la aplicación con **Has Persistent Data** activado y **Do not expose as web app** seleccionado; normalmente las bases de datos no sirven HTTP a través de NGINX.
2. Configura el usuario, la contraseña y el nombre de la base de datos mediante los ajustes de la aplicación o el instalador One-Click. Utiliza credenciales únicas y mantenlas fuera del repositorio.
3. Monta un volumen con nombre o un bind mount en el directorio de datos real de la imagen. Asigna la aplicación al nodo que contiene ese almacenamiento.
4. Despliega la base de datos y consulta los logs hasta que esté lista para aceptar conexiones. Reinicia o vuelve a desplegar una vez para comprobar que los datos persisten.
5. Desde otra aplicación, conecta usando el nombre del servicio y el puerto interno del contenedor. Publica un puerto del host solo si necesitas clientes externos; sigue los pasos de firewall y seguridad de la [guía de conexión externa](#conectar-a-bases-de-datos-desde-fuera-de-caprover).
6. Programa backups específicos para ese motor de base de datos y prueba una restauración. El backup de configuración de CapRover no incluye los registros de la base de datos.

Consulta la documentación de la imagen elegida para verificar rutas de datos y variables de inicialización; pueden variar entre PostgreSQL, MySQL, Redis y otros servicios.

<span id="source-data-persistence-internal-databases"></span>

## Conectar a bases de datos desde otras aplicaciones

- Las aplicaciones de la red overlay de CapRover pueden acceder a la base de datos mediante el nombre del servicio y el puerto del contenedor.
- Para PostgreSQL con una aplicación llamada `postgres`, utiliza el host `postgres` y el puerto `5432`, junto con el nombre, usuario y contraseña configurados.

- Por ejemplo, establece la variable `DATABASE_URL` de tu aplicación web con la cadena de conexión apropiada para el driver.
- Guarda la configuración y ejecuta una consulta de prueba.
- No necesitas publicar ningún puerto.
- Las aplicaciones actualizadas desde versiones anteriores a CapRover 1.15 pueden conservar nombres o alias `srv-captain--`. Si falla la resolución del hostname, comprueba el nombre real del servicio.

- Guarda las credenciales en las variables de entorno de la aplicación o en un mecanismo adecuado de secretos. Comprueba que la base de datos tenga almacenamiento persistente y backups.
- Si todavía no tienes una base de datos instalada, consulta primero [Desplegar bases de datos](deploy-databases.md).

<span id="source-data-persistence-external-databases"></span>

## Conectar a bases de datos desde fuera de CapRover

- Si el cliente también se ejecuta en CapRover, utiliza la conexión interna.
- Para clientes externos, decide si necesitas publicar un puerto con acceso restringido o usar un túnel antes de exponer la base de datos a Internet.

### Preparar la base de datos

Despliega la base de datos como se describe arriba y comprueba en los logs que esté lista antes de habilitar el acceso.

### Publicar un puerto restringido

- En **App Config** de la base de datos, mapea un puerto del host, por ejemplo `12345/tcp`, al puerto del contenedor, como `5432/tcp` para PostgreSQL.
- Guarda los cambios y comprueba que la actualización del servicio se haya completado.
- Desde el cliente, conecta a `SERVER_PUBLIC_IP:12345` con el usuario y la contraseña de la base de datos.

- En el firewall del proveedor, permite `12345/tcp` **únicamente desde las direcciones IP de los clientes autorizados**.
- Comprueba también las reglas del host: los puertos publicados por Docker pueden eludir las restricciones habituales de UFW.
- En un clúster, elige conscientemente entre los modos de publicación ingress y host y comprueba qué nodo recibe las conexiones.
- Utiliza TLS y autenticación robusta del protocolo de base de datos cuando el tráfico pase por redes no confiables. El mapeo de puertos no cifra las conexiones.

### Preferir una conexión privada cuando sea posible

- Una VPN o un túnel que llegue a la red overlay de CapRover permite evitar la publicación de un puerto de base de datos.
- El acceso SSH al host no implica que el host pueda resolver o alcanzar automáticamente los nombres internos de los servicios Docker.
- El punto de entrada del túnel debe tener conectividad con la red overlay. Verifica su ubicación y permisos antes de depender de él.

Cuando el acceso funcione, pruébalo desde el cliente externo previsto, elimina reglas temporales demasiado permisivas y documenta el puerto, los clientes autorizados, quién administra las credenciales, los backups y el plan de retirada.
