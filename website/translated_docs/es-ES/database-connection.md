---
id: database-connection
title: Conexión de base de datos
sidebar_label: Conexión de base de datos
---

<br/>

Todas las bases de datos que implementa como [aplicación de un clic](one-click-apps) se implementan como Docker contenedores. El nombre de cada contenedor tiene el prefijo `srv-captain--` para evitar conflictos con otros contenedores que puedan estar ejecutándose en el mismo host. Todos los contenedores pueden comunicarse entre sí a través de la red superpuesta Docker. La arquitectura de la red es algo como esto:


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

El tipo de conexión más simple es cuando desea conectarse a `Database1` desde `App2` en el diagrama anterior. En este caso, puede simplemente conectarse a `srv-captain--database1` y especificar el puerto. NO HAY NECESIDAD de mapeo de puertos o configuración adicional. Su código se parece a esto:

```
databaseEngine.connect(
    {
        host: srv-captain--database1,
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
ssh -L 8181:srv-captain--mysql:3306 root@<ip of your CapRover Server> -p 4646
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
