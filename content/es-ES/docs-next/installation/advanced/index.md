---
id: index
title: Instalación avanzada
slug: /installation/advanced
---

<span id="source-installation-local-private-network"></span>

## Red local / privada

- Ejecute CapRover en una máquina con una IP privada para pruebas locales o un servidor doméstico.
- Primero decidir si será accesible sólo en su LAN o desde el Internet público.
- Un nombre de host privado no puede recibir un certificado de cifrado público a través del desafío habitual de HTTP.

### Prepare la máquina

- Instalar Docker Engine como se describe en [Configuración manual](../manual.md), y verificar con `sudo docker version`.
- Dale a la máquina una dirección LAN estable.
- En este ejemplo es `192.168.1.12`.
- Antes de la instalación, crear `/captain/data/config-override.json` para saltar la verificación DNS pública que no es adecuada para un dominio privado:

```bash
sudo mkdir -p /captain/data
echo '{"skipVerifyingDomains":true}' | sudo tee /captain/data/config-override.json
sudo docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=192.168.1.12 \
  -p 80:80 -p 443:443 -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  caprover/caprover
```

Utilice la IP LAN real de la máquina en `MAIN_NODE_IP_ADDRESS`. De otro dispositivo LAN, abierto `http://192.168.1.12:3000` y cambiar la contraseña inicial. Permitir estos puertos a través del cortafuegos de la máquina para sus clientes previstos.

### Nombre de host local de desarrollo

- Sobre sistemas que resuelven `*.localhost` a la máquina local, uso `captain.localhost` como el dominio raíz y `http://captain.captain.localhost` para el dashboard.
- Si comodín `.localhost` la resolución no está disponible, utilice un servidor DNS local para su dominio de desarrollo elegido; un sencillo `/etc/hosts` entrada no puede proporcionar DNS comodín.
- Para Docker Desktop, asegúrese `/captain` se comparte / monta correctamente antes de la instalación.
- Uso `MAIN_NODE_IP_ADDRESS=127.0.0.1` para una prueba localhost de una sola máquina. Evite la validación de cifrado público para dominios localeshost.

### Solo dominio privado

- Configurar un servidor DNS local para apuntar `*.apps.home.example` a `192.168.1.12`, y establecer el dominio raíz de CapRover `apps.home.example` en el dashboard.
- Si su servidor DNS no puede crear registros de tarjetas silvestres, añadir `captain.apps.home.example` y cada subdominio de aplicaciones individualmente.
- El archivo hosts en un ordenador no proporciona DNS comodín a otros dispositivos.
- Revise la resolución de nombre de un cliente antes de crear una aplicación.

Use HTTP en este nombre solo privado. No active el flujo de CapRover para un dominio que no puede resolver y ser alcanzado desde el Internet público.

### Acceso público a través del router

- Para un dominio público y HTTPS, puntee el DNS público comodín Un registro a la dirección IPv4 pública de su router.
- Puerto del router `80/tcp` a `192.168.1.12:80` y `443/tcp` a `192.168.1.12:443`.
- El servidor debe mantener una IP LAN estable, y las conexiones de entrada deben llegar al router; NAT de grado portador puede prevenir esta configuración.

- Establecer el dominio de raíz pública en CapRover, verificar `captain.<root-domain>` resuelve y alcanza el servidor sobre HTTP, a continuación, activar el dashboard y la aplicación HTTPS como se describe en [Comienzo](../../get-started.md).
- Mantenga el puerto de administración `3000` restringido a su LAN u otra vía de acceso de confianza en lugar de remitirlo públicamente.

<span id="source-installation-advanced-custom-host-ports"></span>

## Puertos de acogida personalizados

- CapRover normalmente publica HTTP en el puerto del host 80, HTTPS en 443, y la interfaz de administración inicial en 3000.
- En un servidor nuevo, utilice esos defectos.
- Cuando otro servicio ya ocupa un puerto del host, utilice el arranque manual y cambie tanto el lado host del mapeo de Docker como el emparejado `CAPTAIN_HOST_*` ajuste:

```bash
sudo docker run -p 10080:80 -p 10443:443 -p 13000:3000 \
  -e ACCEPTED_TERMS=true \
  -e CAPTAIN_HOST_HTTP_PORT=10080 \
  -e CAPTAIN_HOST_HTTPS_PORT=10443 \
  -e CAPTAIN_HOST_ADMIN_PORT=13000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  caprover/caprover
```

- Los puertos laterales de contenedores permanecen 80, 443, y 3000.
- El acceso inicial en este ejemplo es `http://SERVER_IP:13000`.
- Abra sólo los puertos del host requeridos por su arquitectura.
- Un flujo de certificado público y ordinario `https://your-domain` Las direcciones URL todavía necesitan puertos externos 80 y 443 encaminadas a CapRover; cambiar sus puertos del host por sí solo no encamina esos puertos estándar.
- Planifique su proxy inverso o reenvío de puerto antes de habilitar HTTPS.

CapRover pasa estos valores de host-port en sus servicios en la instalación. Cambiar el puerto publicado de una instalación existente requiere cuidado extra y está fuera de este ejemplo de instalación fresca.

<span id="source-installation-advanced-reverse-proxy"></span>

## Escenarios Proxy inversos

- CapRover ya ejecuta NGINX para sus aplicaciones de panel y web.
- La instalación pública más simple permite a CapRover puertos propios 80 y 443.
- Si otro proxy inverso debe terminar primero el tráfico, planifique el enrutamiento antes de instalar CapRover.

- El proxy externo debe pasar solicitudes para el dashboard y todos los dominios de aplicación a CapRover, preservar el original `Host` header, soporte WebSocket actualizaciones para aplicaciones que las necesitan, y manejar la expedición y renovación de certificados deliberadamente.
- El propio desafío de Encrypt HTTP de CapRover necesita sus solicitudes de validación para llegar a CapRover en el puerto 80.
- Terminar HTTPS en un proxy no proporciona automáticamente HTTPS entre el proxy y CapRover.

- Para una instalación fresca detrás de un proxy que posee los puertos de host estándar, vea [Puertos de acogida personalizados](index.md) publicar CapRover en diferentes puertos del host.
- Verifique el enrutamiento del panel, una aplicación de muestra y el comportamiento del certificado antes de mover el tráfico existente.
- Consulta [Cloudflare y Proxies Inversos](../../domains/cloudflare-reverse-proxies.md) para las consideraciones de nivel de dominio.

Las configuraciones proxy inversas dependen del proxy y del límite TLS deseado. Esta página no prescribe una configuración universal; se aplazará una configuración específica de proveedor probado.

<span id="source-installation-advanced-existing-swarm"></span>

## Existing Docker Swarm

- CapRover normalmente inicializa Docker Swarm durante la instalación.
- El `useExistingSwarm` configuración override permite al instalador unirse a un Swarm inicial existente en su lugar.
- Esto es avanzado: primero entender cómo el nodo manager de CapRover, NGINX, registro y servicios persistentes serán colocados en sus nodos.

En el nodo manager previsto, confirme que `sudo docker info` reporta un Swarm activo y que este nodo puede manejarlo. Asegurar que los puertos de redes Swarm estén abiertos entre los nodos de confianza: `2377/tcp`, `7946/tcp`, `7946/udp`, y `4789/udp`Mantenga el tráfico superpuesto privado.

Antes de la primera instalación, escriba el override en el directorio persistente de CapRover:

```bash
sudo mkdir -p /captain/data
echo '{"useExistingSwarm":true}' | sudo tee /captain/data/config-override.json
```

- Ejecute el comando Docker bootstrap en [Configuración manual](../manual.md) en este nodo manager. El instalador automatizado rechaza la preexistente `/captain` configuración y no es adecuado para esta anulación.
- CapRover lee `useExistingSwarm` y utiliza el Swarm existente.
- Hacer esto en un clúster desechable o cuidadosamente planificado primero: CapRover crea y gestiona servicios y redes en ese Swarm, y su estado persistente permanece bajo `/captain` en el nodo CapRover.

Para programar aplicaciones más allá de un nodo, se requiere un registry de push predeterminado antes de añadir nodos a través de CapRover. Leer [Configurar un Cluster Multi-Nodo](../../scaling/multi-node.md) antes de desplegar aplicaciones a través de nodos.

<span id="source-guides-home-server"></span>

## Inicio / Configuración de servidores locales

Para una prueba local, use [Instalación de redes locales / privadas](index.md)Un despliegue en el hogar público también necesita una manera estable de entrar en el tráfico para llegar al host.

1. Dar al host una dirección LAN estable. Para instalación manual Docker, uso [Configuración manual](../manual.md).
2. Para el estándar [instalador](../../get-started.md), adelante TCP 80, 443, y 3000 de su router al host. El instalador informa de controles de capacidad externa después de la configuración; NAT y firewalls proveedores todavía necesitan atención manual.
3. Instala CapRover, luego señala el nombre de host Wildcard DNS y el dashboard a la dirección pública del router. Si su ISP cambia esa dirección, utilice un proceso de actualización DNS confiable.
4. Completar los pasos de raíz-dominio y HTTPS en [Comienzo](../../get-started.md), y verificar el dashboard y una aplicación de prueba de un dispositivo **afuera** la LAN.
5. Después de que el panel funciona sobre HTTPS desde fuera de la LAN, retire la regla de reenvío del puerto público 3000 y mantenga el acceso del administrador a través del nombre de host de dashboard. Respalde tanto el estado de CapRover como los datos de aplicaciones fuera del sitio.

- NAT de grado de portador, puertos de entrada bloqueados, o una conexión IPv6 solo puede prevenir el acceso público normal y la emisión de certificados.
- En esos casos utiliza un VPS público, un proxy/tunnel reverso adecuado con su propio modelo de seguridad, o mantiene la instalación privada.
- Revise su router e ISP antes de solucionar problemas CapRover.
