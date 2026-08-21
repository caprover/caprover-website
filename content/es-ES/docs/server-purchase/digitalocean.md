---
id: digitalocean
title: Configurando CapRover con DigitalOcean
sidebar_label: DigitalOcean
---


Si es la primera vez que configura un servidor, DigitalOcean es probablemente la solución más sencilla para usted. Además, ¡puedes usar este enlace y obtener un crédito de $100!
https://m.do.co/c/6410aa23d3f3

DigitalOcean llama a sus servidores "Droplets". Después de registrarse, vaya a la sección Droplets y haga clic en "Crear Droplet". En elegir una imagen, haga clic en One-Click Apps y seleccione Docker. De esta manera, Docker viene preinstalado con su servidor. Si tiene una clave SSH, ingrese su clave SSH en la parte inferior de esta página Crear Droplet; si no, no se preocupe, es solo una contraseña alternativa. Una vez creado su Droplet, recibirá un correo electrónico con la dirección IP de su servidor, usuario y contraseña. Si sabes cómo SSH, entonces genial, SSH en tu servidor. Si no, ¡no te preocupes! DigitalOcean es realmente amigable para principiantes. Simplemente vaya a la sección Droplets en su cuenta DigitalOcean, haga clic en el Droplet que creó. En el menú del lado izquierdo, seleccione ACCESO e inicie la consola. Ingrese `root` cuando se le solicite iniciar sesión e ingrese la contraseña que recibió por correo electrónico. Si no recibió su contraseña por correo electrónico, haga clic en Restablecer contraseña raíz debajo del botón Iniciar consola. Tenga en cuenta que deberá escribir su contraseña larga. La interfaz web que le ofrece DigitalOcean no admite Copiar/Pegar ctrl+c ctrl+v.

En este punto, ha iniciado sesión en su servidor y puede ejecutar el instalador de Captain como se explica en la sección Introducción.
