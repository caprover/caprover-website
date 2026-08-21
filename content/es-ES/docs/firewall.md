---
id: firewall
title: Cortafuegos y reenvío de puertos
sidebar_label: Cortafuegos y reenvío de puertos
---

<br/>


Captain usos:
- 80 TCP para conexiones regulares HTTP
- 443 TCP/UDP para conexiones seguras HTTPS y HTTP/3
- 3000 TCP para la instalación inicial Captain (se puede bloquear una vez que Captain se adjunta a un dominio)
- 7946 TCP/UDP para descubrimiento de redes de contenedores
- 4789 TCP/UDP para red de superposición de contenedores
- 2377 TCP/UDP para Docker enjambre API
- 996 TCP para conexiones seguras HTTPS específicas de Docker Registry

En el caso de un servidor ubuntu, ejecute

```
ufw allow 80,443,3000,996,7946,4789,2377/tcp; ufw allow 7946,4789,2377,443/udp;
```


Tenga en cuenta que para una instalación más segura solo puede exponer 80/443/3000 al mundo, el resto de los puertos solo se usan en un clúster y bastaría con abrirlos a los demás nodos del clúster. 
Si tiene una sola instancia, simplemente ejecute:

```
ufw allow 80,443,3000
```


Además, si está utilizando la asignación de puertos para permitir conexiones externas, por ejemplo desde su computadora portátil a una instancia MySQL en Captain, también deberá agregar el puerto correspondiente a la exclusión.


NOTA:
Docker omite ufw para los puertos asignados. Si agregó manualmente un puerto asignado para cualquiera de sus aplicaciones implementadas en CapRover, ufw no necesariamente bloquea los puertos. Consulte la [información relevante aquí](
https://askubuntu.com/questions/652556/uncomplicated-firewall-ufw-is-not-blocking-anything-when-using-docker)

