---
id: multi-node
title: Configurar un Cluster Multi-Nodo
slug: /scaling/multi-node
---

CapRover utiliza Docker Swarm. El nodo manager administra los servicios de control de CapRover; los workers realizan tareas de aplicación.

**Antes de añadir un nodo:** Prepare Docker, redes privadas, SSH y un registro compartido.

## 1. Prepare servidor

En el nuevo servidor Ubuntu, instale Docker Engine:

```bash
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker version
sudo docker info --format '{{.Swarm.LocalNodeState}}'
```

- Utilice una IP estable accesible desde el administrador.
- El estado de Swarm de Docker debería ser `inactive`.
- Elija **worker** para hospedadores de aplicaciones comunes. Los roles de administrador requieren la planificación del quórum.

## 2. Redes y SSH

**Entre los nodos de confianza sólo:**

- `2377/tcp`: Gestión del cisma
- `7946/tcp` y `7946/udp`: Comunicación de nodos
- `4789/udp`: Redes de superposición

**SSH:**

1. Utilice una clave privada dedicada y un usuario con acceso Docker (generalmente root).
2. Añadir la clave pública al nuevo servidor `authorized_keys`.
3. Prueba SSH **del nodo manager** al nuevo servidor.
4. Dale a CapRover la llave privada durante la configuración del nodo.

La membresía del clúster Docker da acceso equivalente a la raíz. Mantenga los puertos SSH y Swarm restringidos a los hosts de confianza. Revisar reglas UFW CapRover añade durante la unión.

## 3. Registry

1. Configure a [registry predeterminado](../deployments/registries/index.md) alcanzable por **todos los nodos**. CapRover lo requiere antes de añadir nodos.
2. Implementar aplicaciones construidas antes de que el registro fuera habilitado para empujar sus imágenes.
3. Verificar el nuevo nodo puede tirar de una imagen de nueva build. Las imágenes privadas preconstruidas también necesitan acceso para tirar.

## 4. Agregar y verificar el nodo

1. En **Cluster → Nodos**, ingrese el administrador y los IPs de workers, SSH host/port/user, clave privada y papel de nodo.
2. Únete al nodo. Verificar que parece saludable y comprobar `docker node ls` en el nodo manager.
3. Escalar un **apátridas** la aplicación de prueba y la colocación de cheques `docker service ps SERVICE_NAME`.
4. Prueba el dominio de la aplicación. Si la colocación falla, inspeccionar tiras del registro, salud de nodos y errores de tarea.

## 5. Aplicaciones persistentes

- Los volúmenes locales y las monturas de sujeción permanecen en su nodo.
- CapRover pins aplicaciones persistentes; unir un nodo no copia datos.
- Atrás y migrar datos antes de cambiar la colocación.
- Consulta [Aplicaciones persistentes en clústeres](multi-node.md).

<span id="source-scaling-manage-nodes"></span>

## Nodos de gestión

Usar el **Cluster → Nodos** vista y `docker node ls` en un gerente para comprobar la disponibilidad y el papel del nodo. `docker service ps SERVICE_NAME` muestra dónde funcionan las tareas de una aplicación y por qué una tarea no comenzó.

- Antes de eliminar o drenar un nodo, identifique sus aplicaciones de funcionamiento y cualquier volumen local o monturas de unión.
- Las tareas apátridas generalmente se pueden reprogramar si las imágenes están disponibles en el registro; los datos persistentes no los siguen automáticamente.
- Retroceder y mover datos deliberadamente antes de cambiar la colocación.

- Mantenga la gestión de Swarm y los puertos superpuestos restringidos a direcciones de nodos de confianza.
- Si un nodo no puede unirse, verifique que Docker está instalado, su Swarm es inactivo, las credenciales de SSH funcionan desde el administrador, y el registro y las rutas internodo son accesibles.

<span id="source-scaling-persistent-apps"></span>

## Aplicaciones persistentes en clústeres

- CapRover normalmente limita una aplicación persistente a una instancia en un nodo seleccionado.
- Un Docker llamado volumen usando el controlador local predeterminado y una montura bind almacenan datos en ese nodo; un segundo nodo no verá automáticamente esos archivos.

- Para mover una aplicación persistente, el respaldo y el quiesce escribe, restaurar datos en el destino, comprobar permisos, actualizar la colocación, luego verificar la aplicación con una instancia.
- Mantenga la copia vieja hasta que se pruebe la nueva instancia.
- Un fallo de nodo puede hacer que una aplicación no esté disponible hasta que sus datos sean restaurados en otros lugares.

- Almacenamiento compartido o externo es un diseño avanzado que debe apoyar los requisitos de consistencia y escritura simultánea de la aplicación.
- El aumento del número de instancias por sí solo no proporciona ese almacenamiento.
- Consulta [Almacenamiento compartido / externo](../data-persistence/shared-storage.md).

<span id="source-scaling-networking"></span>

## Redes multinodo

- La red de superposición de Docker Swarm permite que los servicios se comuniquen a través de los nodos.
- Entre los nodos de confianza, permiso `2377/tcp` para la gestión, `7946/tcp` y `7946/udp` por comunicación de nodos, y `4789/udp` por tráfico superpuesto.
- Restringir estos puertos a direcciones de nodos; el tráfico web público todavía alcanza el punto de entrada HTTP/HTTPS de CapRover.

- Un puerto de aplicación pública `ingress` El modo puede usar la malla de goma.
- En `host` modo que se publica donde se ejecuta la tarea, así que la colocación afecta las respuestas de la dirección del nodo.
- Para el tráfico interno de bases de datos, utilice el nombre de servicio de la aplicación de destino y el puerto de contenedores sin una asignación pública.

Si un nuevo nodo se une pero las tareas no pueden comunicarse, compruebe los cortafuegos entre nodos, el estado de servicio Docker y la membresía de la red antes de cambiar la configuración de la aplicación. Ver todo [puerto de referencia](../reference/ports.md).
