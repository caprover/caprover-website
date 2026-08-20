---
id: backup-and-restore
title: Copia de seguridad y restauración
sidebar_label: Copia de seguridad y restauración
---

### Copia de seguridad y restauración

_Esta característica se agregó en v1.3.0._

_La función Copia de seguridad/Restauración aún se encuentra en etapa experimental. Habrá más cambios en el futuro._

La copia de seguridad/restauración es un proceso complicado y requiere comprender cómo funcionan los diferentes componentes en la instancia CapRover. Si planea utilizar esta función, asegúrese de leer este documento detenidamente, practique con un servidor de prueba y aprenda el proceso antes de utilizar esta función en producción.

**TDLR;** La copia de seguridad/restauración normal funciona para todo excepto imágenes y volúmenes. Para imágenes, debe usar un Docker Registry (tiene ventajas y desventajas), para volúmenes, debe usar una solución personalizada (tiene ventajas y desventajas).

### Proceso de copia de seguridad

En su instancia CapRover de trabajo, abra el panel web, navegue hasta la página de configuración y haga clic en el botón "Crear copia de seguridad". Después de unos segundos, comenzará la descarga. Conserve el archivo tar y lo utilizará al restaurar la instancia CapRover.

#### Automatización del proceso de copia de seguridad

Puede crear un script bash simple para copias de seguridad automatizadas:

```bash
    API_TOKEN=$(curl $CAPROVER_URL/api/v2/login \
        -H 'x-namespace: captain' \
        -H 'content-type: application/json;charset=UTF-8' \
        --data-raw "{\"password\":\"$CAPROVER_PASSWORD\"}" \
        --compressed --silent | jq -r ".data.token")

    DOWNLOAD_TOKEN=$(curl $CAPROVER_URL/api/v2/user/system/createbackup \
        -H "x-captain-auth: $API_TOKEN" \
        -H 'x-namespace: captain' \
        --data-raw '{"postDownloadFileName":"backup.tar"}' \
        --compressed --silent | jq -r ".data.downloadToken")

    if [ ${#DOWNLOAD_TOKEN} -le 10 ]; then
        echo "DOWNLOAD_TOKEN must be at least 10 char long"
        exit 1
    fi

    wget "$CAPROVER_URL/api/v2/downloads/?namespace=captain&downloadToken=$DOWNLOAD_TOKEN" -O backup.tar
```

### Proceso de restauración

Este proceso es muy similar a la nueva instalación de CapRover, excepto algunas diferencias. Siga los pasos de Requisitos previos de [Comenzar](get-started.md) y asegúrese de tener Docker instalado en un servidor.

_NO HACER_ ejecute el comando de instalación `docker run -p 80:80 -p 443:443.....`. En su lugar, siga los siguientes pasos:

_(reemplace 123.123.123.123 con su servidor IP en las instrucciones a continuación)_

1. Cree un directorio `/captain` vacío en su servidor ejecutando <br/> `ssh root@123.123.123.123 mkdir /captain`
2. Cambie el nombre del archivo de copia de seguridad que desee a `backup.tar` en su escritorio.
3. Copie `backup.tar` al servidor: <br/> `scp ./backup.tar root@123.123.123.123:/captain/`
4. Instale CapRover:

```bash
docker run -p 80:80 -p 443:443 -p 3000:3000 -e ACCEPTED_TERMS=true -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

CapRover detectará automáticamente su `backup.tar`, lo extraerá y restaurará todas sus configuraciones y ajustes.

5. Debe configurar su DNS de manera que `*.youroldroot.domain.com` apunte al nuevo servidor IP.

### Mantener el servidor antiguo

En algunos casos, todavía tienes el servidor anterior ejecutándose y solo deseas crear un clon de tu servidor. Como desea que su antiguo servidor siga funcionando, no debe cambiar su DNS para el dominio anterior. En su lugar, desea asignar uno nuevo. En este caso:

1. Cree una nueva entrada comodín en su DNS `*.yournewroot.domain.com` y apúntela al nuevo servidor
2. En su computadora de escritorio, cree una entrada temporal en su archivo `etc/hosts` y agregue esta línea

```
NEW-SERVER-IP-ADDRESS   captain.oldroot.domain.com
```

TENGA EN CUENTA que no puede usar comodines en el archivo de hosts, simplemente agregue el dominio para el panel para poder acceder a él temporalmente.

3. Vaya a `captain.oldroot.domain.com` en su navegador e inicie sesión en el panel.

TENGA EN CUENTA que es posible que vea un error SSL, puede hacer clic en avanzar e ignorar. Esto está bien ya que es posible que su certificación SSL haya caducado. Se renovará una vez que configures todo y reinicies CapRover.

4. Después de iniciar sesión en el panel, continúe y cambie su dominio raíz a `yournewroot.domain.com` en el panel.

5. Vuelva a habilitar las certificaciones SSL y Fuerza HTTPS para su panel y otras aplicaciones si lo desea.

6. Edite su `etc/hosts` y elimine la línea que agregó en el paso 2.

### ¿Qué se restaura?

CapRover El proceso de copia de seguridad realiza una copia de seguridad de todo lo que se encuentra en su directorio `/captain/data/`. Esto incluye la configuración de su aplicación, configuraciones, SSL certificados, etc. Lo que no incluye son: **Imágenes de contenedor** y **Directorios persistentes**

1. **Imágenes del contenedor:** Después de restaurar una instancia de CapRover, notará que las configuraciones de su aplicación están configuradas; sin embargo, todas sus aplicaciones se revierten al estado predeterminado de "¡Su aplicación estará aquí!". Necesita volver a implementar todas sus aplicaciones. Lo bueno de este enfoque es que su archivo `backup.tar` es realmente pequeño y manejable. La desventaja de este enfoque, por supuesto, es tener que volver a implementar todas sus aplicaciones. Si realmente desea que las imágenes se guarden en una copia de seguridad, debe usar un [Docker Registry](#d-r).
2. **Directorios persistentes:** Algunas aplicaciones, como las bases de datos, tienen un directorio persistente. Ya que cada base de datos tiene su propio mecanismo de respaldo. Se recomienda utilizar el método de copia de seguridad adecuado para su base de datos específica, como `mongodump` para MongoDB o `mysqldump` para MySQL, etc. Este es el mejor enfoque para las bases de datos, ya que no provoca un tiempo de inactividad. El otro enfoque es crear una instantánea de los volúmenes. Este enfoque es genérico y funciona en prácticamente todo. Por ejemplo, puede utilizar este [Proyecto de terceros](https://github.com/loomchild/volume-backup). Sin embargo, antes de ejecutar esto, para evitar la corrupción de datos, debe asegurarse de que sus contenedores estén detenidos `docker service ls --format {{.Name}} | while read in; do docker service scale "$in"=0; done` y luego tomar una instantánea y luego reanudar todos los servicios `docker service ls --format {{.Name}} | while read in; do docker service scale "$in"=1; done`. En un futuro próximo, CapRover tendrá una solución integrada como esta.
   Otras herramientas útiles para realizar copias de seguridad de sus directorios persistentes son:

- https://github.com/futurice/docker-volume-backup
- https://github.com/loomchild/volume-backup
- https://github.com/blacklabelops/volumerize
- https://github.com/schickling/dockerfiles/tree/master/postgres-backup-s3
- https://github.com/schickling/dockerfiles/tree/master/mysql-backup-s3

<details>
  <summary>Docker Registry</summary>


### Docker Registry Instrucciones

Como se señaló anteriormente, las imágenes de contenedor no forman parte de la copia de seguridad. Para asegurarse de que sus aplicaciones no requieran una nueva implementación después del proceso de restauración, debe asegurarse de estar usando un Docker Registry. Un Docker Registry es un lugar donde se almacenarán las imágenes de tus aplicaciones.

#### Registro de terceros

Si configura el "registro de envío predeterminado" en su panel CapRover en la sección Clúster, cada imagen se enviará al registro una vez que se haya creado en el servidor. Esta es la mejor opción ya que es una entidad separada y usted no es responsable de conservar sus imágenes. Una vez que restaure su instancia CapRover, ¡todo funcionará de maravilla!

#### Registro autohospedado

Si configura el "registro push predeterminado" en CapRover registro autohospedado, su aplicación funcionará de inmediato después del proceso de restauración. Sin embargo, en el lado negativo, tu `backup.tar` será muy grande. Este archivo incluirá todas las imágenes creadas en su servidor.

Si previamente había configurado el registro autohospedado, pero cambió de opinión y deshabilitó el registro autohospedado para cambiar a un registro de terceros, sus archivos de respaldo seguirán siendo grandes ya que los archivos todavía están en su sistema host. Si desea eliminar todas las imágenes almacenadas en su registro, elimine el directorio de registro `rm -rf /captain/data/registry`

</details>

<details>
  <summary>Configuración de múltiples nodos</summary>


### Nodos múltiples

¿Qué sucede cuando tienes un clúster? El proceso de copia de seguridad y restauración es prácticamente el mismo que el de un solo nodo, excepto que durante la restauración, la primera ejecución sale después de detectar que está intentando restaurar un clúster. Se le solicita que edite un archivo y agregue IP direcciones de nuevos nodos.

Por ejemplo, anteriormente tenías 2 nodos:

- 222.222.222.10 (Nodo principal)
- 222.222.222.11

Para la restauración has preparado 2 nodos:

- 222.222.222.20 (Nodo principal)
- 222.222.222.21

Ejecuta el script de restauración en `222.222.222.20` y el script sale pidiéndole que ingrese la información para el segundo nodo. Edita el archivo de instrucciones de restauración e ingresa `222.222.222.21` como el nuevo IP para el antiguo IP de `222.222.222.11`.

A continuación, debe copiar su clave privada (generalmente llamada `id_rsa`) a su servidor. Por ejemplo, en Linux:

```bash
scp /home/myuser/.ssh/id_rsa root@123.123.123.123:/captain/
```

_Asegúrese de eliminar este archivo del servidor una vez que finalice el proceso de restauración_

Ahora vuelva a ejecutar el script de restauración (el mismo que salió y solicitó más información). Ahora este proceso continúa y sus nodos se restaurarán, las aplicaciones se ajustarán para moverse a los nuevos nodos. Por ejemplo, si anteriormente tenía una aplicación persistente bloqueada en el segundo nodo, también estará bloqueada en el segundo nodo en la instancia restaurada.

La restauración del volumen del clúster es un poco más complicada. Pero si estás utilizando un clúster, probablemente sepas lo que estás haciendo :-)

</details>
