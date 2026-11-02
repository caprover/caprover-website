---
id: index
title: Instalación avanzada
slug: /installation/advanced
---

<span id="source-installation-local-private-network"></span>

## Red local o privada

- Puedes ejecutar CapRover en un servidor con IP privada para pruebas locales o para un servidor doméstico.
- Decide primero si estará disponible únicamente desde la LAN o también desde Internet.
- Un hostname privado no puede obtener un certificado público de Let's Encrypt mediante el desafío HTTP habitual si no es accesible desde Internet.

### Preparar el servidor

- Instala Docker Engine siguiendo la [instalación manual](../manual.md) y compruébalo con `sudo docker version`.
- Asigna una IP LAN estable a la máquina.
- En este ejemplo usaremos `192.168.1.12`.
- Antes de instalar, crea `/captain/data/config-override.json` para omitir la validación DNS pública, que no es adecuada para dominios privados:

```bash
sudo mkdir -p /captain/data
echo '{"skipVerifyingDomains":true}' | sudo tee /captain/data/config-override.json
sudo docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=192.168.1.12 \
  -p 80:80 -p 443:443 -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  caprover/caprover
```

Sustituye la IP de `MAIN_NODE_IP_ADDRESS` por la IP LAN real del servidor. Desde otro dispositivo de la LAN, abre `http://192.168.1.12:3000` y cambia la contraseña inicial. Permite los puertos necesarios en el firewall del servidor solo para los clientes autorizados.

### Hostname para desarrollo local

- En sistemas donde `*.localhost` resuelve a la máquina local, utiliza `captain.localhost` como dominio raíz y `http://captain.captain.localhost` como URL del dashboard.
- Si no tienes resolución wildcard de `.localhost`, configura un DNS local para el dominio elegido. Una entrada normal en `/etc/hosts` no permite DNS wildcard.
- En Docker Desktop, comprueba que `/captain` esté montado y compartido correctamente antes de instalar.
- Para pruebas únicamente en la máquina local, utiliza `MAIN_NODE_IP_ADDRESS=127.0.0.1`. No intentes validar certificados públicos Let's Encrypt para localhost.

### Dominio únicamente privado

- Configura el DNS local para que `*.apps.home.example` apunte a `192.168.1.12`, y utiliza `apps.home.example` como dominio raíz en el dashboard.
- Si tu servidor DNS no admite registros wildcard, añade `captain.apps.home.example` y cada subdominio de aplicación por separado.
- El archivo hosts de un equipo no proporciona DNS wildcard a los demás dispositivos.
- Comprueba la resolución DNS desde un cliente antes de crear aplicaciones.

Utiliza HTTP para este dominio privado. No actives el flujo público de Let's Encrypt de CapRover para un dominio que no puede resolverse y alcanzarse desde Internet.

### Acceso público mediante el router

- Si necesitas un dominio público y HTTPS, apunta el registro A wildcard del DNS público a la IPv4 pública del router.
- Redirige el puerto `80/tcp` del router a `192.168.1.12:80` y el `443/tcp` a `192.168.1.12:443`.
- Mantén una IP LAN estable. Las conexiones entrantes deben llegar al router; CGNAT del proveedor puede impedirlo.

- Configura el dominio raíz público en CapRover, verifica que `captain.<root-domain>` resuelva y pueda accederse por HTTP y después activa HTTPS para el dashboard y las aplicaciones, como se explica en [Primeros pasos](../../get-started.md).
- Restringe el puerto de administración `3000` a la LAN o a un acceso de confianza; evita redirigirlo públicamente.

<span id="source-installation-advanced-custom-host-ports"></span>

## Puertos personalizados del host

- Por defecto, CapRover publica HTTP en el puerto 80 del host, HTTPS en 443 y el dashboard inicial en 3000.
- En servidores nuevos, usa preferiblemente esos puertos.
- Si ya están ocupados, realiza la instalación manual modificando tanto el puerto del host en el mapeo Docker como la variable `CAPTAIN_HOST_*` correspondiente:

```bash
sudo docker run -p 10080:80 -p 10443:443 -p 13000:3000 \
  -e ACCEPTED_TERMS=true \
  -e CAPTAIN_HOST_HTTP_PORT=10080 \
  -e CAPTAIN_HOST_HTTPS_PORT=10443 \
  -e CAPTAIN_HOST_ADMIN_PORT=13000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  caprover/caprover
```

- Los puertos del contenedor siguen siendo 80, 443 y 3000.
- En este ejemplo, el acceso inicial se realiza mediante `http://SERVER_IP:13000`.
- Abre solo los puertos del host necesarios para tu arquitectura.
- Para obtener certificados públicos y utilizar URLs habituales como `https://your-domain`, los puertos externos 80 y 443 deben seguir enrutándose a CapRover. Cambiar los puertos del host no configura automáticamente esa ruta.
- Configura el reverse proxy o port forwarding antes de habilitar HTTPS.

CapRover utiliza estos puertos del host al instalar sus servicios. Cambiar los puertos publicados en una instalación existente requiere más precauciones y queda fuera de este ejemplo de instalación nueva.

<span id="source-installation-advanced-reverse-proxy"></span>

## Escenarios con reverse proxy

- CapRover ya incluye NGINX para servir el dashboard y las aplicaciones web.
- La instalación pública más sencilla deja que CapRover administre los puertos 80 y 443.
- Si necesitas que otro reverse proxy reciba primero el tráfico, define el enrutamiento antes de instalar.

- El proxy externo debe enviar las peticiones del dashboard y de todos los dominios de aplicaciones a CapRover, conservar el header `Host`, admitir WebSocket upgrade cuando haga falta y gestionar conscientemente la emisión y renovación de certificados.
- El desafío HTTP de Let's Encrypt de CapRover debe poder llegar a CapRover por el puerto 80.
- Terminar HTTPS en un proxy no garantiza que el tramo entre el proxy y CapRover esté cifrado.

- Si el proxy utiliza los puertos estándar, consulta [Puertos personalizados del host](index.md) para publicar CapRover en otros puertos.
- Prueba el enrutamiento del dashboard, una aplicación de prueba y los certificados antes de migrar tráfico existente.
- Consulta [Cloudflare y reverse proxies](../../domains/cloudflare-reverse-proxies.md) para los detalles relacionados con DNS y dominios.

La configuración exacta depende del proxy y de dónde termine TLS. Esta guía no ofrece una configuración universal; primero debes validar el comportamiento concreto de tu proveedor.

<span id="source-installation-advanced-existing-swarm"></span>

## Docker Swarm existente

- CapRover inicializa Docker Swarm durante una instalación habitual.
- El override `useExistingSwarm` permite utilizar un Swarm que ya está inicializado.
- Es una configuración avanzada: planifica dónde se ejecutarán el manager, NGINX, el registry y los servicios persistentes de CapRover.

En el manager previsto, verifica mediante `sudo docker info` que Swarm está activo y que el nodo tiene permisos de administración. Abre los puertos de comunicación entre nodos de confianza: `2377/tcp`, `7946/tcp`, `7946/udp` y `4789/udp`. Mantén el tráfico overlay en una red privada.

Antes de instalar, escribe el override en el directorio persistente de CapRover:

```bash
sudo mkdir -p /captain/data
echo '{"useExistingSwarm":true}' | sudo tee /captain/data/config-override.json
```

- Ejecuta el comando Docker de [Instalación manual](../manual.md) en ese manager. El instalador automático rechaza una configuración `/captain` preexistente, por lo que no sirve para este caso.
- CapRover lee `useExistingSwarm` y usa el Swarm existente.
- Prueba primero en un clúster descartable o bien planificado: CapRover creará y administrará servicios y redes en ese Swarm, y guardará su estado persistente bajo `/captain` en el nodo CapRover.

Para distribuir aplicaciones entre varios nodos, configura un default push registry antes de añadir nodos mediante CapRover. Lee [Configurar un clúster multinodo](../../scaling/multi-node.md) antes de desplegar aplicaciones en más de un nodo.

<span id="source-guides-home-server"></span>

## Configurar un servidor doméstico o local

Para pruebas locales, sigue [Instalación en red local o privada](index.md). Para exponer un servidor doméstico a Internet necesitas una ruta estable de acceso entrante.

1. Asigna una IP LAN estable al host. Si instalas Docker manualmente, consulta [Instalación manual](../manual.md).
2. Si usas el [instalador habitual](../../get-started.md), redirige los puertos TCP 80, 443 y 3000 del router al host. El instalador comprueba la accesibilidad externa al terminar, pero debes configurar NAT y firewalls del proveedor por separado.
3. Instala CapRover y apunta el DNS wildcard y el hostname del dashboard a la IP pública del router. Si tu ISP cambia la IP, configura un proceso fiable de actualización de DNS.
4. Termina la configuración de dominio raíz y HTTPS indicada en [Primeros pasos](../../get-started.md). Comprueba el dashboard y una aplicación desde un dispositivo **fuera** de la LAN.
5. Cuando el dashboard funcione por HTTPS desde el exterior, elimina la regla de redirección pública del puerto 3000 y accede mediante el hostname del dashboard. Guarda backups externos del estado de CapRover y de los datos de las aplicaciones.

- CGNAT, puertos entrantes bloqueados o conexiones solo IPv6 pueden impedir el acceso público habitual y la emisión de certificados.
- En esos casos, utiliza un VPS público, un proxy o túnel adecuado con sus propias medidas de seguridad, o conserva la instalación como privada.
- Comprueba primero las limitaciones del router y del ISP antes de investigar errores de CapRover.
