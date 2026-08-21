---
id: best-practices
title: Mejores prácticas
sidebar_label: Mejores prácticas
---

CapRover está diseñado para ser fácil de usar e intuitivo. Dicho esto, existen algunos consejos y trucos que pueden ayudarte a aprovechar al máximo CapRover.

### Dominio raíz oculto

Siempre es una buena práctica ocultar su pila de tecnología al atacante potencial. Para estar más seguro, puede ocultar su dominio raíz dos niveles más profundos que su configuración comodín DNS. Por ejemplo, en su panel DNS configuró

```bash
A RECORD:

*.server.domain.com   >>>>   123.123.123.123
```

Luego, al configurar CapRover, en lugar de ingresar `server.domain.com`, ingrese `something.server.domain.com`. De esta manera, puede acceder al panel a través de `captain.something.server.domain.com` y no de `captain.server.domain.com`. Luego puede configurar el dominio de su aplicación en `myapp.server.domain.com` en la configuración HTTP de la aplicación para ocultar su dominio raíz.

Ten en cuenta que esto no es un escudo que te protege de todo. Es solo una medida de seguridad que hace que sea más difícil y casi impráctico para algunos atacantes de fuerza bruta atacar su infraestructura CapRover.

### Contraseña predeterminada personalizada

CapRover usa `captain42` como contraseña predeterminada. Esto suele ser seguro ya que puede cambiar su contraseña ejecutando `caprover serversetup` desde su máquina local inmediatamente después de finalizar la instalación del servidor. Sin embargo, esto deja una pequeña ventana de aproximadamente 30 segundos para que el atacante cambie su contraseña antes que usted. Esto es muy poco probable, pero es posible que ocurra este ataque. El atacante necesita conocer la ventana de ataque exacta en una máquina en particular. De todos modos, para mitigar este riesgo, simplemente elija una contraseña inicial personalizada al instalar CapRover agregando `DEFAULT_PASSWORD` env var al script de instalación. Por ejemplo, el siguiente script cambia la contraseña predeterminada de `captain42` a `myinitialpassword`

```bash
docker run -e ACCEPTED_TERMS=true -e DEFAULT_PASSWORD='myinitialpassword' -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

### Hacer cumplir HTTPS

Se recomienda encarecidamente que una de las primeras cosas que haga sea habilitar HTTPS y habilitar "Enforce HTTPS" para su panel CapRover. Una vez que haya hecho todo esto, debe cambiar su contraseña. Tenga en cuenta que si está utilizando el asistente `caprover serversetup`, realizará este proceso automáticamente, no es necesario cambiar su contraseña después de la configuración.

### Usar cuentas de servicio para Git

Una de las características más populares de CapRover es la implementación automática desde el control de fuente (GitHub, BitBucket, GitLab, etc.). Para que este enfoque funcione con un repositorio privado, debe ingresar su nombre de usuario/contraseña y se mantendrán como contenido cifrado en su servidor. Siempre es una buena práctica crear una cuenta de servicio (cuenta bot) en GitHub, etc., y otorgarle a esa cuenta permiso específico (solo lectura) para ciertos repositorios únicamente. De modo que si esa cuenta se vio comprometida, su cuenta de propietario principal permanece intacta y puede eliminar la cuenta comprometida del repositorio.

### Sin memoria al construir

Cuando construyes en un servicio pago como Heroku, tu proceso de construcción ocurre en una máquina con CPU y RAM altos. Cuando usas CapRover, tu compilación se realiza en la misma máquina que sirve tu aplicación. Esto no es un problema hasta que su aplicación crezca demasiado y el proceso de compilación requiera demasiado RAM. En ese caso, ¡su proceso de construcción podría fallar! Vea [**this**](https://github.com/caprover/caprover/issues/315) por ejemplo. Hay múltiples soluciones:

1- Agregar espacio de intercambio al servidor web, explicado [**aquí**](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04).

2- Construya en su máquina local. Por ejemplo, este proceso se explica en detalle [**aquí**](recipe-deploy-create-react-app.md) para Crear React aplicación.

3- Sin embargo, **la mejor solución** es utilizar un sistema de compilación independiente. Puedes ver la guía [**aquí**](ci-cd-integration.md)

### Personaliza la configuración NGINX para nuevas aplicaciones

Movido a https://caprover.com/docs/nginx-customization.html#customize-and-override-the-nginx-config-for-all-apps

Esta sección se mantiene aquí para evitar la rotura del enlace.
