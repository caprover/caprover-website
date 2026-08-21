---
id: database-connection
title: Conexión de base de datos
sidebar_label: Conexión de base de datos
---

<br/>

Las bases de datos desplegadas como [aplicaciones de un clic](one-click-apps) se ejecutan como servicios Docker. Las aplicaciones del mismo clúster de CapRover pueden comunicarse mediante la red superpuesta de Docker. Las instalaciones actuales usan el nombre de la aplicación como nombre de host del servicio. Las aplicaciones actualizadas desde versiones anteriores a 1.15 pueden conservar un nombre físico con el prefijo `srv-captain--`; CapRover mantiene ese alias de red por compatibilidad. La arquitectura de la red es la siguiente:


```bash
          Outside World
              +
              |
+---------+---+---+-----------------------------+
|         |       |                             |
|         | NGINX |                             |
|         |       |                             |
|      +--+-------+---+                         |
|      |              |                         |
|      |              |                         |
|  +---v--+     +-----v+      +-----------+     |
|  | App1 |     | App2 +------> Database1 |     |
|  +------+     +------+      +-----------+     |
|                                               |
+-----------------------------------------------+
```


### Conexiones internas

La conexión más sencilla es desde `App2` a `Database1` en el diagrama anterior. Use el nombre de la aplicación `database1` y su puerto de contenedor. Esta conexión interna no requiere un mapeo público de puertos:

```
databaseEngine.connect(
    {
        host: database1,
        port: 5000
    }
)
```


### Conexiones externas

**IMPORTANTE** si tienes problemas con la conexión externa, es probable que tengas una configuración incorrecta. CapRover está probado en batalla y se garantiza su funcionamiento. Vea una serie de errores comunes [aquí](https://github.com/caprover/caprover/issues/364)

A veces, es necesario conectarse a una base de datos del mundo exterior. En este caso tienes dos opciones:

1) Reenvío de puertos
Ésta es la solución más sencilla. Simplemente navega a la página App Config en CapRover y asigna un puerto de host arbitrario al puerto de la base de datos. Por ejemplo, el puerto MySql predeterminado es `3306`, puede asignar el puerto `12345` del host al puerto `3306` del contenedor y luego, desde su máquina local, hacer algo como esto:

```
databaseEngine.connect(
    {
        host: <ip address of your CapRover server>,
        port: 12345
    }
)
```

Asegúrese de permitir el puerto de host en su firewall. De lo contrario, no podrá conectarse a su base de datos.


2) SSH Túnel
Este método es más avanzado. Para hacer esto, primero debe implementar una aplicación de un solo clic SSH. Puede seleccionar esto de la lista oficial de aplicaciones de un clic en su instancia CapRover. Asegúrese de elegir una contraseña larga y segura. Durante la configuración, también se le pedirá que proporcione un puerto para asignar esta imagen SSH. Por defecto utiliza el puerto `4646`. Asegúrese de que este puerto pueda pasar a través de su firewall. Una vez implementada esta nueva imagen, ahora puede desde su máquina local ejecutar el siguiente comando:
```
ssh -L 8181:mysql:3306 root@<ip of your CapRover Server> -p 4646
```

Esto asignará su puerto local de `8181` al puerto de contenedor MySQL `3306`. Ahora, desde tu máquina local, puedes ejecutar algo como esto:
```
databaseEngine.connect(
    {
        host: localhost,
        port: 8181
    }
)
```
**IMPORTANTE:** Tenga en cuenta que no puede SSH hacer un túnel a su base de datos desde el SSH normal en el servidor. Usted **debe** crear un contenedor SSH. SSH en el host no puede comunicarse con el contenedor.

```bash

     HOST SYSTEM
    +-----------------------------------------------------------------+
    |                                 +-------------------+           |
    |                                 |                   |           |
    |                                 |  SSHD ON HOST     |           |
    |                                 +-------------------+           |
    |                                                                 |
    |                                                                 |
    |   DOCKER OVERLAY NETWORK (isolated environment)                 |
    | +-------------------------------------------------------------+ |
    | |                                                             | |
    | |    +----------------+         +--------------------+        | |
    | |    |                |         |                    |        | |
    | |    |  SSH Container |         | Database Container |        | |
    | |    |                +-------->+                    |        | |
    | |    +-----^----------+         +--------------------+        | |
    | |          |                                                  | |
    | +-------------------------------------------------------------+ |
    |            |                                                    |
    +-----------------------------------------------------------------+
                 |
                 |
                 |
       +-----------+
       |    YOU    |
       +-----------+
```
