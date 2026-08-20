---
id: get-started
title: Primeros pasos
sidebar_label: Primeros pasos
---

## Configuración sencilla

El método recomendado para instalar CapRover es mediante la aplicación DigitalOcean de un clic. CapRover está disponible como aplicación de un clic en el mercado DigitalOcean.

Tenga en cuenta que si es un nuevo usuario DigitalOcean, recibirá **\$100 de crédito gratis** una vez que se registre durante los primeros dos meses. ¡Esto es suficiente para dos meses de múltiples servidores!

Si utiliza este método, puede omitir la sección **Requisitos previos** y el paso 1 de **Configuración de CapRover** a continuación.

<br/>

<a href="https://marketplace.digitalocean.com/apps/caprover?action=deploy&refcode=6410aa23d3f3" target="_blank" rel="noreferrer noopener">
<img src="/img/do-btn-blue.svg" alt="CreateDroplet" style="width:300px;"/>
</a>

<br/>

## Requisitos previos

### A) Nombre de dominio

Durante la instalación, se le pedirá que indique una entrada comodín DNS a su dirección CapRover IP. Esto le costará tan solo \$2 al año (¡o [incluso menos](https://www.reddit.com/r/selfhosted/comments/sp8etq/comment/hwdgztx/?utm_source=reddit&utm_medium=web2x&context=3)!)

Tenga en cuenta que también puede utilizar CapRover sin un dominio. Pero no podrás configurar HTTPS.

### B) Servidor

#### B1) IP pública

_Nota al margen: puede [instalar CapRover localmente](run-locally.md) en su computadora portátil en una red privada que esté detrás de NAT (su enrutador). Pero si desea habilitar HTTPS y/o acceder a las aplicaciones desde fuera de su red privada, necesitará alguna configuración especial, como el reenvío de puertos._

En la instalación estándar, CapRover debe instalarse en una máquina con una dirección IP pública. Si necesita ayuda con una IP pública, consulte [Servidor y dirección IP pública](server-purchase/digitalocean.md). Esto le costará tan solo $5 al mes. Si utiliza el código de referencia DigitalOcean, obtendrá un crédito de $100, dos meses de servidor gratuito: https://m.do.co/c/6410aa23d3f3

#### B2) Especificaciones del servidor

_**Arquitectura de CPU**:_ El código fuente de CapRover es compatible con cualquier arquitectura de CPU y la imagen Docker disponible en Docker Hub está compilada para CPU AMD64 (X86), ARM64 y ARMV7.

_**Pila recomendada**:_ CapRover se prueba en Ubuntu 24.04 y Docker 25+. Si está utilizando CapRover en un sistema operativo diferente, es posible que desee consultar [Docker Docs](https://docs.docker.com/engine/userguide/storagedriver/selectadriver/#supported-storage-drivers-per-linux-distribution).

_**RAM mínima**:_ Tenga en cuenta que el proceso de compilación a veces consume demasiada RAM, y 512 MB de RAM pueden no ser suficientes (consulte [este issue](https://github.com/caprover/caprover/issues/28)). La mayoría de los proveedores ofrecen un mínimo de 1 GB de RAM en instancias de \$5, incluidas DigitalOcean, Vultr, Scaleway, Linode y SSD Nodes.

#### B3) Docker

Su servidor debe tener Docker instalado. Si obtiene su servidor de DigitalOcean, puede seleccionar un servidor con la aplicación de un clic CapRover y todo se instalará automáticamente. De lo contrario, puede instalar Docker CE siguiendo [esta instrucción](https://docs.docker.com/engine/installation). Tenga en cuenta que su versión Docker debe ser, al menos, la versión 25.x+.

**EVITE la instalación instantánea** [la instalación instantánea de Docker tiene errores](https://github.com/caprover/caprover/issues/501#issuecomment-554764942). Utilice las instrucciones de instalación oficiales para Docker.

#### B4) Configurar el cortafuegos

Algunos proveedores de servidores tienen configuraciones de firewall estrictas. Para desactivar el firewall en Ubuntu:

```bash
ufw allow 80,443,3000,996,7946,4789,2377/tcp; ufw allow 7946,4789,2377/udp;
```

Consulte [configuración del firewall](firewall.md) si necesita más detalles.

<br/>
<br/>

# Configuración de CapRover

## Paso 1: Instalación de CapRover

¡Simplemente ejecute la siguiente línea, siéntese y disfrute!

```bash
docker run -p 80:80 -p 443:443 -p 3000:3000 -e ACCEPTED_TERMS=true -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

NOTA: no cambie las asignaciones de puertos. CapRover solo funciona en los puertos especificados.

Verá un montón de resultados en su pantalla. Una vez que se inicializa CapRover, puede visitar `http://[IP_OF_YOUR_SERVER]:3000` en su navegador e iniciar sesión en CapRover usando la contraseña predeterminada `captain42`. Puede cambiar su contraseña más tarde. **Sin embargo, no realice ningún cambio en el panel**. Usaremos la herramienta de línea de comandos para configurar el servidor (recomendado).

## Paso 2: Conectar el dominio raíz

Digamos que tienes `mydomain.com`. Puede configurar `*.something.mydomain.com` como `A-record` en su configuración de DNS para que apunte a la dirección IP del servidor donde instaló CapRover. Tenga en cuenta que este cambio puede tardar varias horas en surtir efecto. Aparecerá así en tus configuraciones DNS:

- **TIPO**: Un registro
- **ANFITRIÓN**: `*.something`
- **PUNTOS A**: (IP Dirección de su servidor)
- **TTL**: (realmente no importa)

Para confirmar, vaya a https://mxtoolbox.com/DNSLookup.aspx e ingrese `randomthing123.something.mydomain.com` y verifique si la dirección IP se resuelve en la IP que configuró en su DNS. Tenga en cuenta que `randomthing123` es necesario porque configuró una entrada comodín en su DNS al configurar `*.something` como su host, no `something`.

> **NOTA**: CapRover requiere que un registro apunte a la dirección IP de CapRover. Si utiliza servicios proxy, como Cloudflare, puede tener dificultades. CapRover no admite oficialmente tales casos de uso.

## Paso 3: Configurar e inicializar CapRover

### Con CLI (recomendado)

Suponiendo que tiene npm instalado en su máquina local (por ejemplo, su computadora portátil), simplemente ejecute (agregue `sudo` si es necesario):

```bash
 npm install -g caprover
```

Entonces, corre

```bash
 caprover serversetup
```

Siga los pasos e inicie sesión en su instancia CapRover. Cuando se le solicite ingresar el dominio raíz, ingrese `something.mydomain.com` suponiendo que configuró `*.something.mydomain.com` para que apunte a su dirección IP en el paso 2. Ahora puedes acceder a tu CapRover desde `captain.something.mydomain.com`. Puede leer más sobre cómo ocultar el dominio raíz [aquí](./best-practices.md#hidden-root-domain).

> **NOTA**: **No será posible continuar con el `caprover serversetup` si ya has forzado https en tu instancia CapRover.**
> En tal caso, vaya directamente a iniciar sesión con el comando `caprover login`. Para cambiar la contraseña, vaya al menú de configuración de la aplicación.

### Con la interfaz web (no requiere npm)

1. Inicie sesión en `http://[IP_OF_YOUR_SERVER]:3000`
2. Configurar el dominio raíz
3. Habilite HTTPS, luego fuercelo
4. Una vez que esté conectado a través de HTTPS, cambie la contraseña predeterminada (`captain42`)

## Paso 4: (Opcional) Configurar el archivo de intercambio

En algunos casos puedes tener problemas por no tener suficiente RAM físico.
Por ejemplo, al crear una imagen Docker, si comienza a ocupar demasiada memoria, la compilación fallará.
Para solucionar estos problemas (sin comprar más RAM), puede configurar un archivo de intercambio (que se usa como virtual RAM),
siguiendo estas instrucciones en [Cómo crear un Linux archivo de intercambio](https://linuxize.com/post/create-a-linux-swap-file/).

## Paso 5: Implementar la aplicación de prueba

Vaya a CapRover en su navegador, en el menú de la izquierda seleccione Aplicaciones y cree una nueva aplicación. Nómbrelo `my-first-app`. Luego, descarga cualquiera de las aplicaciones de prueba <a href="https://github.com/caprover/caprover/tree/master/captain-sample-apps">aquí</a>, descomprime el contenido. y mientras estás dentro del directorio de la aplicación de prueba, ejecuta:

```bash
/home/Desktop/captain-examples/captain-node$  caprover deploy
```

Siga las instrucciones, ingrese `my-first-app` cuando se le solicite el nombre de la aplicación. La primera vez que se construye tarda unos dos minutos. Una vez completada la compilación, visite `my-first-app.something.mydomain.com` donde `something.mydomain.com` es su dominio raíz.
¡FELICITACIONES! ¡¡Tu aplicación está activa!!

Puede conectar varios dominios personalizados (como `www.my-app.com`) a una sola aplicación y habilitar HTTPS y hacer mucho más en la página de configuración de la aplicación.

Tenga en cuenta que cuando ejecute `caprover deploy`, la confirmación git actual se enviará a su servidor.

> **IMPORTANTE**: Los archivos no confirmados y los archivos en `gitignore` NO se enviarán al servidor.

Puede visitar CapRover en el navegador y establecer parámetros personalizados para su aplicación, como variables de entorno, ¡y hacer mucho más! Para obtener más detalles sobre la implementación, consulte [CLI documentos](cli-commands.md). Para obtener detalles sobre el archivo `captain-definition`, consulte [Captain Archivo de definición](captain-definition-file.md).
