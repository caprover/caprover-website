---
id: run-locally
title: Ejecutar localmente
sidebar_label: Ejecutar localmente
---

<br/>
Tenga en cuenta que este es un **proceso avanzado**. Algunos de los conceptos utilizados en esta sección no son fáciles para los principiantes. Para ejecutar CapRover en su máquina local (solo para pruebas y desarrollo), necesita Docker instalado en su máquina.

<br/>

> Nota: Si prefiere tutoriales visuales, consulte este tutorial creado por la comunidad en YouTube: https://www.youtube.com/watch?v=J_6H11DrzXY

En cuanto al dominio raíz, de forma predeterminada, CapRover usa `http://captain.captain.localhost`. En la mayoría de los sistemas, `captain.captain.localhost` se resuelve automáticamente en la dirección IP local de la máquina, es decir, 127.0.0.1 y, por lo tanto, no es necesario ningún trabajo adicional.

> Sin embargo, si no lo hace automáticamente, debe apuntar manualmente `*.captain.localhost` a `127.0.0.1` o `192.168.1.2` (su IP local). **NOTA** que `etc/hosts` no será suficiente ya que Captain necesita una entrada comodín y `etc/hosts` no permite comodines, es decir, `*.something`. En ubuntu 16, `dnsmasq` (un servidor DNS local) está integrado. Entonces, es tan simple como editar este archivo: `/etc/NetworkManager/dnsmasq.d/dnsmasq-localhost.conf` (créelo si no existe) y agregarle esta línea: `address=/captain.localhost/192.168.1.2` donde `192.168.1.2` es su dirección IP local. Para asegurarse de tener `dnsmasq`, puede ejecutar `which dnsmasq` en su terminal. Si está disponible, su ruta se imprimirá en el terminal; de lo contrario, no habrá nada impreso en su terminal.
> Nota: Para Ubuntu 18, lea https://askubuntu.com/questions/1029882/how-can-i-set-up-local-wildcard-127-0-0-1-domain-resolution-on-18-04

Para verificar que tiene ambos requisitos previos mencionados anteriormente:

- Ejecute `docker version` y asegúrese de que su versión sea al menos la versión mencionada en [docs](get-started#b3-docker)
- Ejecute `nslookup randomstring123.captain.localhost` y asegúrese de que se resuelva en `127.0.0.1` o su IP local (algo como `192.168.1.2`):

```
Server:		127.0.1.1
Address:	127.0.1.1#53

Name:	randomstring123.captain.localhost
Address: 192.168.1.2
```

## Instalación

Una vez que haya confirmado que tiene los requisitos previos listos, puede continuar e instalar Captain en su máquina, de manera similar a lo que hace en su servidor. Asegúrese de ejecutar como usuario con permiso suficiente, es decir, `sudo` en sistemas basados ​​en Linux. Simplemente siga los pasos que se describen aquí: [Captain Instalación](get-started#paso-1-instalación-de-caprover), excepto por algunas diferencias que se mencionan a continuación.

### Diferencias:

#### Principal IP

En primer lugar, el comando de instalación para la instalación local requiere un parámetro adicional (`MAIN_NODE_IP_ADDRESS`)

```bash
echo  "{\"skipVerifyingDomains\":\"true\"}" >  /captain/data/config-override.json
docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=127.0.0.1 -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```
**NOTA:** ​​si los puertos 80 y 443 están actualmente ocupados y desea ejecutar CapRover detrás de un proxy inverso, [ver aquí](https://github.com/caprover/caprover/issues/1166#issuecomment-2430704491).

#### Configuración

No ejecute `caprover serversetup`. En su lugar, vaya a http://captain.captain.localhost:3000 y configure manualmente el dominio raíz en `captain.localhost`. NO habilite/fuerce HTTPS. Obviamente, no puedes habilitar HTTPS en tu dominio local (captain.localhost).

Una vez que configure su dominio raíz como `captain.localhost`, use `caprover login` e ingrese `http://captain.captain.localhost` como su capitán URL y `captain42` como su contraseña predeterminada.

> Sin embargo, si desea acceder a su instancia CapRover desde otro dispositivo en su LAN, puede configurar el dominio raíz en `captain.LOCAL_IP.sslip.io` (por ejemplo, `captain.192.168.1.2.sslip.io`).

**USUARIOS SIN LINUX**
Debe agregar `/captain` a las rutas compartidas.
Para hacerlo, haga clic en el ícono Docker -> Configuración -> Compartir archivos y agregue `/captain`

¡Estás listo!

## Instalar CapRover en una red privada [local]

Esto es útil cuando desea instalar CapRover en su red doméstica, por ejemplo en una Raspberry pi.

Imagina que tienes esta red:

```
┌───────────────────────┐
│    Your Router        │
│                       │
│     public IP         │
│    11.22.33.44        │           your private network
├───────────────────────┴─────────────────────────────────────────────────────────────────────┐
│                                                                                             │
│ ┌────────────────┐      ┌──────────────────┐        ┌──────────────────┐                    │
│ │                │      │                  │        │                  │                    │
│ │    PC1         │      │     PC2          │        │       PC3        │                    │
│ │                │      │                  │        │                  │                    │
│ │  192.168.1.10  │      │    192.168.1.11  │        │    192.168.1.12  │                    │
│ │                │      │                  │        │                  │                    │
│ └────────────────┘      └──────────────────┘        └──────────────────┘                    │
│                                                                                             │
│                                                                                             │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

Puede instalar CapRover en PC3 simplemente ejecutando este comando:

```bash
echo  "{\"skipVerifyingDomains\":\"true\"}" >  /captain/data/config-override.json
docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=192.168.1.12 -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

El único bit adicional es este: ` -e MAIN_NODE_IP_ADDRESS=192.168.1.12` y también deshabilitar la verificación de dominio en CapRover.

En este punto, debería poder acceder a su panel CapRover desde la PC1 y la PC2 a través de `http://192.168.1.12:3000` en su navegador.

Aún así no puedes implementar aplicaciones, pero deberías poder acceder al panel.
Si no se puede acceder al panel, tiene un firewall interno que impide que la PC1 acceda a la PC3.

Si se puede acceder al tablero, continúe con las siguientes etapas.

### opción 1: solo caso de uso interno:

Puede instalar CapRover en su red interna para que solo sea accesible desde su red privada. Si desea hacer eso, debe asignar `*.caproverinstance.local` o algo similar en su servidor DNS local para que apunte a `192.168.1.12`. Si no tiene un servidor DNS local, no puede hacer esto.

Algunos servidores DNS locales, como PiHole, no permiten comodines en las entradas DNS locales; en ese caso, debe agregar `captain.caproverinstance.local` para apuntar a IP. y en el futuro, agregue los nombres de sus aplicaciones uno por uno. Es tedioso pero factible.

Ahora, vaya al panel a través de `http://192.168.1.12:3000` y actualice el dominio raíz a `caproverinstance.local`.

En este punto, debería poder acceder al panel a través de `http://captain.caproverinstance.local` en su navegador.
Si tiene problemas aquí, significa que su servidor DNS local no funciona como se esperaba. Tendrás que arreglarlo.

Tenga en cuenta que no debe (no puede) habilitar HTTPS para dominios internos.

### opción 2: hacer que la instancia sea accesible desde el exterior.

Requisito: su dirección pública IP debe ser una dirección IP estática.

Esto es muy similar a cómo instalar CapRover en un VPS disponible públicamente. Todo lo que necesitas hacer es habilitar el reenvío de puertos en tu enrutador:

```
port 80 of router => port 80 of 192.168.1.12
port 443 of router => port 80 of 192.168.1.12
```

Ahora utilice su proveedor DNS habitual y asigne `*.domain.com` a la dirección pública IP de su red.

Ahora, como en una instalación normal, simplemente inicie sesión en `http://192.168.1.12:3000` y actualice el dominio raíz a `domain.com`

En este punto, debería poder accederse a su instancia desde `http://captain.domain.com`. Puede habilitar HTTPS e implementar sus aplicaciones.

## Solución de problemas:

Como se mencionó anteriormente, ejecutar una máquina local es una tarea avanzada y puede fallar por diferentes motivos; dependiendo del error, su solución puede ser diferente. Por ejemplo, si recibe el siguiente error:

```
Captain Starting ...
Installing Captain Service ...
December 18th 2017, 11:51:11.295 pm    Starting swarm at 34.232.18.13:2377
Installation failed.
{ Error: (HTTP code 400) bad parameter - must specify a listening address because the address to advertise is not recognized as a system address, and a system's IP address to use could not be uniquely identified
    at /usr/src/app/node_modules/docker-modem/lib/modem.js:254:17
    at process._tickCallback (internal/process/next_tick.js:180:9)
  reason: 'bad parameter',
  statusCode: 400,
  json:
   { message: 'must specify a listening address because the address to advertise is not recognized as a system address, and a system\'s IP address to use could not be uniquely identified' } }
```

Puedes probar esto:

```bash
docker run -e ACCEPTED_TERMS=true -e "MAIN_NODE_IP_ADDRESS=192.168.1.2" -v /var/run/docker.sock:/var/run/docker.sock caprover/caprover
```

y reemplace `192.168.1.2` con su propio IP local.
