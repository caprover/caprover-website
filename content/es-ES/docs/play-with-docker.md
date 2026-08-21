---
id: play-with-docker
title: Juega con CapRover
sidebar_label: Juega con CapRover
---

<br/>

## Demostración de solo visualización

Si solo desea ver la demostración de solo lectura, vaya a la [página de inicio](/) y haga clic en **Demostración en vivo**

<br/>

## Demostración de trabajo

Si desea crear una instancia funcional de CapRover, puede utilizar el sitio web Play-with-Docker. Este es un sitio web que le permite crear servidores virtuales en segundos e instalar Docker imágenes en él. Este es el mejor terreno de juego para jugar con CapRover.


![](/img/pwd-caprover.gif)


Siga estos pasos:
- Asegúrate de tener una cuenta en [Docker Hub](https://hub.docker.com/). Si no lo haces, crea uno, es 100% gratis.
- Vaya a [play-with-docker.com](http://play-with-docker.com/)
- Haga clic en Inicio e inicie sesión con su Docker Hub nombre de usuario/contraseña
- Una vez iniciada tu sesión, verás una página con un temporizador.
- Puede hacer clic en **+AGREGAR NUEVA INSTANCIA** en la barra de menú del lado izquierdo y crear un servidor virtual
- Una vez creado tu servidor, copia y pega este comando:
```bash
 curl -L https://pwd.caprover.com | bash
```

- El proceso de instalación tarda unos 2 minutos y está totalmente automatizado.
- Cuando finalice el proceso de instalación, verás un mensaje como este:
```
===================================
===================================
 **** Installation is done! *****  
CapRover is available at http://captain.ip123456789123456.direct.labs.play-with-docker.com
Default password is: captain42
===================================
===================================
```

¡Simplemente copie el URL e inicie sesión en CapRover usando `captain42` como contraseña!

**IMPORTANTE:** NO PUEDES habilitar https usando play-with-docker, pero otras funciones deberían funcionar normalmente.
