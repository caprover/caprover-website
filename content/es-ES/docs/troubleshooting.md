---
id: troubleshooting
title: Solución de problemas
sidebar_label: Solución de problemas
---

<br/>

Esta sección cubre los problemas más frecuentes que pueden encontrar los usuarios.

## ¿No se puede conectar `ip_server`:3000?

Hay toda una serie de razones para esto.

#### Primero)

Debe asegurarse de que CapRover se esté ejecutando en su servidor. Para comprobar esto, envíe ssh a su servidor y ejecute

```bash
docker service ps captain-captain --no-trunc
```

Es posible que Captain se reinicie constantemente debido a un error. Solucione el problema y vuelva a intentarlo. Por ejemplo, consulte [error al crear la interfaz vxlan](https://github.com/caprover/caprover/issues/14#issuecomment-345447689) o [error al crear la ruta de origen del montaje](https://github.com/caprover/caprover/issues/352). Linode, por ejemplo, tiene problemas conocidos como [falló la unión al sandbox de subred](https://github.com/docker/machine/issues/2753#issuecomment-171822791) y [la interfaz vxlan](https://github.com/docker/machine/issues/2753#issuecomment-188353704). Busque su problema en los [issues de CapRover en GitHub](https://github.com/caprover/caprover/issues) y, si no encuentra una solución, cree un issue nuevo.

#### Segundo)

Si no ve ningún error cuando ejecutó `docker service ps captain-captain --no-trunc`, intente

```bash
docker service logs captain-captain --since 60m

## you should also get the logs from nginx

docker service logs captain-nginx --since 60m
```

Es posible que CapRover se reinicie constantemente debido a un error. Busque su problema en los [issues de CapRover en GitHub](https://github.com/caprover/caprover/issues) y, si no encuentra una solución, cree un issue nuevo.

#### Tercero)

Si los pasos de depuración "Primero" y "Segundo" explicados anteriormente funcionaron bien y no se ve ningún error en los registros, ejecute este comando en su servidor:

```bash
 curl localhost:3000 -v
```

Si tiene éxito, probablemente sea su firewall el que esté bloqueando la conexión. Consulte [Documentos del cortafuegos](firewall.md).

## ¡Implementación exitosa pero error 502 de puerta de enlace incorrecta!

Esto se aplica a usted si:

- Pudiste configurar tu servidor y acceder a él a través de `captain.rootdomain.example.com`.
- Pudiste implementar una de las aplicaciones de muestra (ver [aquí](https://github.com/caprover/caprover/tree/master/captain-sample-apps)) con éxito y funcionó.
- Intentó implementar su propia aplicación y se implementó correctamente, pero cuando intenta acceder a ella a través de `yourappname.root.example.com` aparece un error 502.

Si todos los puntos anteriores son correctos, así es como se soluciona el problema:

- SSH a su servidor y vea los registros de su aplicación. Asegúrese de que no se haya bloqueado y esté funcionando. Para ver los registros, consulte la sección al final de esta página "[Cómo ver el registro de mi aplicación](#how-to-view-my-applications-log)"
- Si los logs muestran que la aplicación se está ejecutando, el caso más común es que esté vinculada a un puerto personalizado, no al puerto 80. Por ejemplo, CouchDB usa el puerto 5984. En este caso, vaya a la configuración de la aplicación en CapRover, abra Configuración HTTP y seleccione 5984 como "Container Port".
- Si su aplicación define la dirección vinculante IP como 127.0.0.1, cámbiela a `0.0.0.0`; consulte [este problema](https://github.com/caprover/caprover/issues/76#issuecomment-481053496) para obtener más detalles.

## Error en la verificación del dominio: ¡Error 1107!

Esto sucede cuando CapRover no puede verificar que yourcustomdomain.com apunte a la dirección IP de CapRover. Esto puede deberse a varios factores:

- DNS los cambios tardan hasta 24 horas en propagarse, especialmente si su servidor los había almacenado en caché antes. Así que espera 24 horas y vuelve a intentarlo. Si no funciona, continúa con el siguiente paso:
- Para confirmar, vaya a https://mxtoolbox.com/DNSLookup.aspx e ingrese `yourcustomdomain.com`. Asegúrate de que apunte al servidor IP. Si estás utilizando un servicio proxy como CloudFlare, esto puede causar un problema. Deshabilite su proxy en su DNS en CloudFlare y haga que el registro A apunte directamente a la dirección IP de su servidor CapRover.
- Si probaste todo lo anterior y cuando visitas `something.domain.com` ves la página CapRover, entonces puedes decir que tu dominio está funcionando bien, pero CapRover no puede verificarlo porque la prueba de bucle invertido no funciona. En este caso, puedes optar por omitir la verificación del dominio realizada por CapRover:

```
echo  "{\"skipVerifyingDomains\":\"true\"}" >  /captain/data/config-override.json
docker service update captain-captain --force
```

- Si nada de lo anterior funciona, abra un problema en Github.
- **AWS EC2 Usuarios** - Verifique que el bloque CIDR de su VPC esté por encima de 172.0.0.0/16 (NO 0.0.0.0/16, que es común).

## Tiempos de espera de conexión

A veces, cuando tiene un grupo de conexiones de base de datos inactivo, Docker interrumpe la conexión después de un tiempo. Para solucionarlo, puede hacer cualquiera de estas cosas:

- Implementar una estrategia de reintento automático.
- Implementar un ping automático cada pocos minutos para garantizar que la conexión no quede inactiva
- Cambiar la configuración Keepalive en su aplicación (consulte [aquí](https://github.com/caprover/caprover/issues/873#issuecomment-715328966) para ver un ejemplo en knex)
- Realiza cambios en tus configuraciones Docker (más avanzadas)

La [causa raíz](https://github.com/moby/moby/issues/31208) no está relacionada con CapRover, es un problema subyacente Docker.

## Algo malo pasó

Cuando ve este error en la interfaz de usuario, significa que algo "inesperado" salió mal, como pérdida de conexión, falla del servidor (debido a falta de memoria), etc. La mejor manera de ver qué sucede es obtener los registros del servidor:

```
docker service logs captain-captain --since 5m --follow
```

## ¿Cómo ver el registro de mi aplicación? {/* #how-to-view-my-applications-log */}

Su aplicación se implementa como un servicio Docker. Por ejemplo, si el nombre de su aplicación en Captain es `my-app`, puede ver sus registros conectándose a su servidor a través de SSH y ejecutando el siguiente comando:

```
docker service logs my-app --since 60m --follow
```

Use `docker service ls` para confirmar el nombre físico del servicio. Las aplicaciones nuevas usan el nombre de la aplicación; las actualizadas desde versiones de CapRover anteriores a 1.15 pueden conservar la forma `srv-captain--my-app`. Reemplace `60m` por `10m` para ver los últimos 10 minutos.

## ¿Cómo reiniciar mi aplicación?

Si su aplicación no se comporta bien, puede intentar forzar su reinicio yendo al panel web y seleccionando su aplicación, luego haga clic en el botón "Guardar configuración y actualización". Reiniciará con fuerza su aplicación.

## Cómo ejecutar Shell dentro de mi aplicación (dentro del contenedor)

Simplemente ejecute el siguiente comando:

```
docker exec -it "$(docker ps --filter label=com.docker.swarm.service.name=myappname -q | head -n1)" /bin/sh
```

Ejecute este comando en el nodo que aloja la tarea y use el nombre físico indicado por `docker service ls`.

Por supuesto, debes reemplazar `myappname` con el nombre de tu propia aplicación.

## ¡Hice un cambio en la configuración Nginx que rompió la interfaz de usuario del administrador!

En este caso, reiniciar no ayudará. [Haz esto](https://github.com/caprover/caprover/issues/412#issuecomment-484077130):

Ejecute el reparador nginx para revertir **todos los nginx cambios que realizó manualmente**:

```bash
docker service scale captain-captain=0 && \
docker run -it --rm -v /captain:/captain  caprover/caprover /bin/sh -c "wget https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/clear-custom-nginx.js ; node clear-custom-nginx.js ;" && \
docker service scale captain-captain=1 && \
echo "OKAY"

```

Esperemos que tu problema se resuelva y puedas ser feliz.

## Cómo reiniciar CapRover

Si su CapRover no se comporta bien, puede intentar forzar el reinicio CapRover usando:

```
docker service update captain-captain --force
```

## Cómo usar la versión Edge

La versión Edge se crea automáticamente con cada pulsación en Master. Si su versión tiene un error particular que acaba de corregirse en la rama maestra, puede actualizar temporalmente su CapRover para usar la versión Edge. Tenga en cuenta que una vez que cambie a Edge, no recibirá actualizaciones. Con la próxima versión de CapRover, deberá volver manualmente a CapRover. Tenga en cuenta que se trata de una operación avanzada. Además, como regla general, una vez que cambie a Edge, no vuelva a la versión normal hasta que se lance una nueva versión.

Para cambiar al borde

```
docker pull caprover/caprover-edge:latest
docker service update captain-captain --image caprover/caprover-edge:latest
```

Para volver a la imagen principal

```
docker service update captain-captain --image caprover/caprover:latest
```

## Personalizar los ajustes de configuración

Puede personalizar cualquier constante definida en [CaptainConstants](https://github.com/caprover/caprover/blob/master/src/utils/CaptainConstants.ts) en configuraciones agregando un archivo JSON en `/captain/data/config-override.json`. Por ejemplo, para cambiar `defaultMaxLogSize`, el contenido de `/captain/data/config-override.json` será:

```
{
 "defaultMaxLogSize":"128m"
}
```

Después de editar este archivo, [reinicie CapRover](https://caprover.com/docs/troubleshooting.html#how-to-restart-caprover) (si el cambio afecta a CapRover, nginx o certbot) o apague y vuelva a encender NetData desde la interfaz de usuario.

## Usar enjambre existente

Cuando instala CapRover por primera vez, intenta configurar automáticamente un clúster de enjambre. Pero en casos excepcionales, es posible que ya tenga un clúster de enjambre y desee utilizar ese clúster. En este caso, simplemente puedes anularlo estableciendo `useExistingSwarm` en verdadero. Ejecute el siguiente script antes de intentar instalar CapRover.

```
mkdir -p  /captain/data
echo  "{\"useExistingSwarm\":\"true\"}" >  /captain/data/config-override.json
```

## AWS configuración

AWS tiene su propia personalización con respecto al manejo de puertos, etc. Requiere alguna configuración personalizada, consulte [esta publicación de blog, por ejemplo](https://fuzzyblog.io/blog/caprover/2019/11/10/using-caprover-on-aws.html).

## CloudFlare SSL configuración

Cuando utilice el plan gratuito CloudFlare, tenga en cuenta que [Universal SSL solo admite SSL hasta subdominios de primer nivel](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/#full-setup). Entonces, si habilita Universal SSL de CloudFlare y configura un subdominio de primer nivel como dominio raíz para CapRover, obtendrá el siguiente error al intentar acceder a las aplicaciones implementadas por CapRover:

```
This site can’t provide a secure connection
app.root.example.com uses an unsupported protocol.
ERR_SSL_VERSION_OR_CIPHER_MISMATCH
```

Si desea utilizar CapRover con el SSL Universal de CloudFlare, evite utilizar un subdominio como dominio raíz.

## Procesador ARM

A partir de 1.8.1, CapRover funciona en procesadores arm como "raspberry pi" y demás. Tenga en cuenta que es posible que algunas aplicaciones de un solo clic no funcionen en rasberry pi. Las aplicaciones de un clic son aplicaciones externas que no son mantenidas por CapRover.

## Restablecer contraseña

Si olvidó su contraseña pero tiene acceso a su servidor a través de SSH:

- SSH a tu servidor
- Ejecute `jq -V` para tener jq instalado
- correr

```bash
docker service scale captain-captain=0

# backup config
cp /captain/data/config-captain.json /captain/data/config-captain.json.backup

# delete old password
jq 'del(.hashedPassword)' /captain/data/config-captain.json > /captain/data/config-captain.json.new
cat /captain/data/config-captain.json.new > /captain/data/config-captain.json
rm /captain/data/config-captain.json.new

# set a temporary password
docker service update --env-add DEFAULT_PASSWORD=mytemppassword captain-captain
docker service scale captain-captain=1
```

- Inicie sesión en CapRover con su contraseña temporal y cambie su contraseña desde la configuración.

## ¿Cómo detener y eliminar Captain?

CapRover usa Docker Swarm para admitir la agrupación en clústeres y el reinicio de contenedores si se detienen. Para desinstalar completamente CapRover de su sistema, ejecute esto:

```
docker service rm $(docker service ls -q)
## remove CapRover settings directory
rm -rf /captain
## leave swarm if you don't want it
docker swarm leave --force
## full cleanup of docker
docker system prune --all --force
```

## Recibí un correo electrónico de Let's Encrypt diciendo que el certificado SSL de mi dominio está venciendo, y no debería estar vencido.

Esto puede suceder cuando usó el mismo nombre de dominio para un proyecto anterior, que luego eliminó.
Let's Encrypt realiza un seguimiento del certificado anterior y le notifica cuando vence, pero esto no afecta el nuevo certificado.
Para confirmar, simplemente verifique su fecha de vencimiento SSL usando una herramienta en línea como esta:
https://www.sslshopper.com/ssl-checker.html#hostname=captain.server.demo.caprover.com
