---
id: app-scaling-and-cluster
title: Escalado de aplicaciones y clúster
sidebar_label: Escalado de aplicaciones y clúster
---

<br/>

CapRover le ofrece múltiples formas de ampliar su aplicación, ejecutándola en múltiples procesos para aprovechar todos los recursos de su servidor.

## Ejecute varias instancias de la aplicación:

Su aplicación Pizza está funcionando muy bien y está recibiendo miles de visitas a su sitio web. Tener una instancia de tu aplicación no es suficiente. Tu latencia ha aumentado. Lo siguiente que debes considerar es ejecutar varias instancias de tu aplicación en tu Captain. Puedes hacerlo desde la sección Aplicaciones de Captain web. Digamos que cambias el recuento de instancias a 3. Captain crea 3 instancias de tu aplicación ejecutándose al mismo tiempo. Si alguno de ellos muere (se estrella), ¡automáticamente genera uno nuevo! ¡Siempre tienes 3 instancias de tu aplicación Pizza ejecutándose! ¿La mejor parte? Captain distribuye automáticamente las solicitudes entre diferentes instancias de su aplicación.

## Ejecute varios servidores:

¡Guau! ¡Tu aplicación Pizza es muy popular! Tienes 3 instancias de tu aplicación ejecutándose en el mismo servidor, RAM y CPU están casi al máximo. Necesitas conseguir un segundo servidor. ¿Cómo se conectan los servidores? Captain hace eso por ti ;-) Simplemente obtienes un servidor con Docker instalado, similar a lo que hiciste para el servidor Captain original. Asegúrese de que se pueda acceder a su nuevo y brillante servidor a través de SSH desde el servidor Captain original (por ejemplo, copiando la clave pública ssh de Captain a su servidor secundario).

CapRover usa [Docker Swarm](https://docs.docker.com/engine/swarm/) debajo del capó. Proporciona una opción para usar CapRover UI para configurar un grupo de nodos. Alternativamente, puede usar comandos Docker Swarm simples `docker swarm join...` para configurar su clúster. No hay absolutamente ninguna diferencia entre los dos métodos. El primer método usa la interfaz de usuario y el segundo método usa la línea de comando.

En este punto, debes ingresar la siguiente información:

- Dirección CapRover IP (vista de forma remota): esta es la dirección IP de su servidor original
- Nuevo nodo IP Dirección (como lo ve Captain): esta es la dirección IP de su segundo servidor
- Clave privada SSH para el usuario `root`: esta es la clave SSH de su servidor CapRover que se utilizará para SSH en su segundo servidor. En Linux, está en `/home/yourusername/.ssh/id_rsa`
- Tipo de nodo: describe cuál es la función del nuevo servidor. Utilice `worker` si es nuevo en Docker; para obtener más detalles, lea https://docs.docker.com/engine/swarm/how-swarm-mode-works/nodes/

Ahora, vaya a la sección "Clúster" de Captain, ingrese los valores en los campos del área "Nodos" y haga clic en Unirse al clúster. ¡Hecho! ¡Ahora tienes tu propio grupo! Ahora puede cambiar el recuento de instancias a 6, y Captain activará algunas instancias en el otro servidor por usted, también equilibra automáticamente la carga de la solicitud y crea nuevas instancias si una máquina muere.

El nodo líder es un administrador que ha sido elegido líder. Este es el nodo donde se ejecutarán Captain y los servicios principales como nginx y Certbot (Let's Encrypt). Todas sus aplicaciones se distribuyen automáticamente a los nodos mediante Docker Swarm.

Tenga en cuenta que solo las aplicaciones sin "Datos persistentes" se pueden escalar entre nodos. Las aplicaciones que tienen habilitados "Datos persistentes" solo se ejecutarán en 1 nodo.

### Registro de inserción predeterminado:

El Push predeterminado Docker Registry es un Docker Registry donde se almacenarán sus aplicaciones tan pronto como las implemente en el servidor.

Para el modo de clúster (más de un servidor), necesitará tener una inserción predeterminada Docker Registry.

### Configuración Docker Registry:

Docker Registry es simplemente el repositorio al que pueden acceder diferentes nodos de un clúster para descargar su aplicación y ejecutarla. Si solo tiene un servidor (sin clúster), no hay ningún beneficio al configurar Docker Registry.

Por otro lado, Docker Registry debe estar configurado y listo para los clústeres. Para configurar el Registro, simplemente vaya a su panel web Captain, seleccione Clúster en el menú y siga las instrucciones. Se le darán dos opciones:

- Docker Registry gestionado por Captain.
- Docker Registry administrado por un proveedor externo.

En la mayoría de los casos, un Registro administrado por Captain debería ser suficiente. Tenga en cuenta que antes de cambiar al clúster desde un solo nodo, si tiene alguna aplicación existente, deberá configurar el Registro y volver a implementar todas las aplicaciones existentes para asegurarse de que se envíen al registro y estén disponibles para todos los nodos, no solo para el nodo líder principal.

### Más de un Registro:

Puede estar conectado a más de un registro a la vez. Por ejemplo, es posible que se conecte a un Docker Registry privado en AWS y a un Docker Registry privado en DockerHub porque algunas de sus aplicaciones (imágenes) están almacenadas en su registro privado AWS, otras están en DockerHub.

Dicho esto, sólo puedes tener un registro push predeterminado. Este es el registro donde se enviarán las imágenes una vez que se hayan creado en el servidor.

### Deshabilitar el registro:

En cualquier momento, tienes la opción de:

- Deshabilitar Registro
- Eliminar detalles de autenticación del registro

Sin embargo, tenga en cuenta que si tiene un clúster (más de un servidor), si elimina el registro de Docker, es posible que sus aplicaciones se comporten mal.

### Agregar un privado Docker Registry:

Si necesita extraer imágenes de un registro de Docker privado como ghcr.io o dockerhub, etc., deberá proporcionar a CapRover sus credenciales para que pueda extraer imágenes. Por ejemplo, para ghcr.io necesitarás lo siguiente:

- Nombre de usuario: `<your github username>`
- Contraseña: [un token personal que usted crea](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) - asegúrese de que tenga acceso para leer paquetes al menos.
- Dominio: `ghcr.io`
- Prefijo de imagen: `<your github username>` (DEBE SER minúscula)

Si las imágenes Docker se almacenan como `your-username/your-image`, utilice su nombre de usuario de github como prefijo de la imagen. De lo contrario, si tiene una organización en github donde sus imágenes se almacenan como `my-org/my-image`, use `my-org` como prefijo de imagen.

Puede configurar sus credenciales en el menú **Cluster**. Si solo desea extraer imágenes, asegúrese de desactivar **Enviar nuevas imágenes**
