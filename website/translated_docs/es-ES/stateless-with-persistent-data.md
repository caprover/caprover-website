---
id: stateless-with-persistent-data
title: Sin estado con datos persistentes
sidebar_label: Sin estado con datos persistentes
---


**Antes de comenzar aquí, lea:**

* [Aplicaciones persistentes](persistent-apps.md)


Esta documentación le ayudará a configurar una aplicación sin estado con datos persistentes. Por ejemplo, un sitio web alojado con "**php:7.4-apache**" que sirve la carpeta "**uploads**" (`/var/www/html/uploads`) o cualquier otra carpeta que defina, por ejemplo, AWS o Wasabi S3, o cualquiera de los otros [sistemas de almacenamiento compatibles con rclone](https://rclone.org/overview/). Esto hace posible tener una aplicación anclada al nodo X y realizar una conmutación por error a otro nodo dentro del mismo Docker enjambre.

Hay varios complementos de volumen de Docker para permitir esta configuración. Yo [@Daniël](https://caprover.slack.com/archives/DLR2Q4TC1) y mi colega Floris comenzamos con "**rexray/s3fs**" pero cambiamos a "**sapk/plugin-rclone**" ya que era más estable y manejaba mejor las fallas del nodo X al Y.

---

**Nota importante:** Los pasos siguientes son para usuarios intermedios y avanzados (*linux*).

---

#### Variables de marcador de posición

* `$volumename` puede ser, por ejemplo, `captain--yourappname-rclone`
* `$remotename` puede ser, por ejemplo, `captain--yourappname`
* `$remotename/path` puede ser, por ejemplo, `captain--yourappname/_data`
* `$rcloneremotename` puede ser, por ejemplo, `wasabi-s3`

---

### 1) Preparando rclone

Comienza creando el archivo `rclone.conf`, esto se puede hacer en cualquier máquina (*local*) que tenga rclone instalado.
Para facilitar esta documentación, asumiremos que tiene [rclone instalado](https://rclone.org/install/) en el nodo principal de su Docker enjambre.

Desde este nodo principal, ejecute "**[rclone config](https://rclone.org/commands/rclone_config/)**" para crear el archivo de configuración, cuando termine, ejecute `rclone config file` para saber dónde está almacenado el archivo de configuración.
Cuando utilice 'root' como usuario, se almacenará en `/root/.config/rclone/rclone.conf`, que usaremos como referencia para la redacción posterior de esta guía.

El archivo `rclone.conf` se verá así:

```
[$rcloneremotename]
type = s3
provider = Wasabi
access_key_id = YourAccessKey
secret_access_key = YourSecretAccessKey
region = eu-central-1
endpoint = s3.eu-central-1.wasabisys.com
env_auth = false
upload_cutoff = 25M
chunk_size = 5M
disable_checksum = false
upload_concurrency = 3
```

Asegúrese de que cada nodo de enjambre tenga el archivo `/root/.config/rclone/rclone.conf`, con exactamente el mismo contenido, verifique nuevamente usando `md5sum /root/.config/rclone/rclone.conf` y compare las sumas de verificación.
*O al menos asegúrate, si hay varias configuraciones disponibles, de que la que usarás sea la misma*

### 2) Prepare su sistema de almacenamiento

Asegúrese de que su depósito S3 (o la carpeta que usará en el sistema de almacenamiento que configuró a través de `rclone config`) realmente exista y que el nombre del depósito/carpeta coincida con el nombre de `$remotename`

### 3) Preparando el complemento Docker rclone

En cada nodo de enjambre, instale el complemento de volumen de Docker con la ayuda de este comando `docker plugin install sapk/plugin-rclone`

Luego ejecute este comando en cada nodo, el siguiente fue especialmente para contenedores "**php:N.N-apache**" (_por ejemplo php:7.4-apache_)

```
docker volume create --driver sapk/plugin-rclone --opt config="$(base64 /root/.config/rclone/rclone.conf)" --opt args="--uid 33 --gid 33 --allow-root --allow-other" --opt remote=$rcloneremotename:$remotename/path --name $volumename
```

Si tiene un depósito S3, en el que los archivos se cargan a través de la interfaz web AWS/Wasabi, o cualquier otra cosa, como SFTPGo montado en el depósito S3, deberá indicarle a rclone que actualice su caché de directorio:

```
docker volume create --driver sapk/plugin-rclone --opt config="$(base64 /root/.config/rclone/rclone.conf)" --opt args="--uid 33 --gid 33 --allow-root --allow-other --dir-cache-time 5s" --opt remote=$rcloneremotename:$remotename/path --name $volumename
```

Lo que sucede es que "**[rclone mount](https://rclone.org/commands/rclone_mount/)**" monta el volumen en los Docker nodos del enjambre, aunque tenga en cuenta que otras banderas/parámetros pueden beneficiar o impactar negativamente la experiencia de su aplicación, así que pruébelos en todo momento.

**El UID y GID anteriores coinciden con Apache2 y pueden diferenciarse de otras aplicaciones.**

### 4) Preparando la aplicación

Luego despliegue una aplicación en blanco sin marcar "**Tiene datos persistentes**" y configure los parámetros que desee en las pestañas "**Configuración HTTP**", "**Configuración de la aplicación**" y "**Deployment**".

En "**Configuraciones de aplicación**" en la sección "**Anulación de actualización de servicio**", coloque lo siguiente.
Tenga en cuenta que `/var/www/html/uploads` es una ruta/carpeta que debe definir usted mismo, pero que se utiliza aquí como referencia.

Establezca el valor "**ReadOnly**" en `true` o `false` según lo que sea apropiado para su aplicación.
Si su aplicación PHP permite a sus usuarios cargar archivos, configúrela en `false`.

```
TaskTemplate:
  ContainerSpec:
    Mounts: [
      {
        "Type": "volume",
        "Source": "$volumename",
        "Target": "/var/www/html/uploads",
        "ReadOnly": false
      }
    ]
```

De esta manera, la aplicación que se ejecuta en "*php:7.4-apache*" puede pasar del nodo1 a cualquier otro nodo que esté configurado correctamente.

Si tienes alguna pregunta o tienes problemas, ponte en contacto a través de Slack en el canal General y, si es necesario, mencióname [@Daniël](https://caprover.slack.com/archives/DLR2Q4TC1) y yo o cualquier otra persona intentaremos ayudarte.
