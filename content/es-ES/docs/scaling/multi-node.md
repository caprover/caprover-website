---
id: multi-node
title: Configurar un clúster multinodo
slug: /scaling/multi-node
---

CapRover utiliza Docker Swarm. El nodo manager ejecuta los servicios de control de CapRover; los nodos worker ejecutan las tareas de las aplicaciones.

**Antes de añadir un nodo:** prepara Docker, una red privada entre nodos, acceso SSH y un registry compartido.

## 1. Preparar el servidor

Instala Docker Engine en el nuevo servidor Ubuntu:

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

- Utiliza una IP estable a la que pueda conectarse el nodo manager.
- El estado de Docker Swarm en el nodo nuevo debe ser `inactive`.
- Para un servidor que solo ejecutará aplicaciones, elige el rol **worker**. Añadir managers requiere planificar el quorum del clúster.

## 2. Red y SSH

**Abre estos puertos solo entre nodos de confianza:**

- `2377/tcp`: gestión de Swarm
- `7946/tcp` y `7946/udp`: comunicación entre nodos
- `4789/udp`: red overlay

**SSH:**

1. Utiliza una clave privada dedicada y un usuario con acceso a Docker, normalmente root.
2. Añade la clave pública a `authorized_keys` en el servidor nuevo.
3. Comprueba la conexión SSH **desde la red del manager** al servidor nuevo.
4. Proporciona la clave privada a CapRover al añadir el nodo.

Pertenecer al grupo Docker da permisos prácticamente equivalentes a root. Restringe SSH y los puertos de Swarm a hosts de confianza. Comprueba las reglas de UFW que CapRover añade al unir nodos.

## 3. Configurar el registry

1. Configura un [registry de push predeterminado](../deployments/registries/index.md) al que puedan acceder **todos los nodos**. CapRover lo necesita para añadir nodos.
2. Vuelve a desplegar las aplicaciones que se construyeron antes de habilitar el registry para publicar sus imágenes.
3. Comprueba que el nuevo nodo puede descargar una imagen recién construida. Las imágenes privadas preconstruidas también necesitan credenciales de pull.

## 4. Añadir y comprobar un nodo

1. En **Cluster → Nodes**, introduce las IP del manager y del worker, host/puerto/usuario SSH, clave privada y rol del nodo.
2. Añade el nodo y comprueba que aparece como saludable. Ejecuta `docker node ls` en el manager.
3. Escala una aplicación de prueba **stateless** y comprueba la distribución con `docker service ps SERVICE_NAME`.
4. Prueba el dominio de la aplicación. Si el scheduling falla, revisa los pulls del registry, el estado del nodo y los errores de las tareas.

## 5. Aplicaciones persistentes

- Los volúmenes locales y bind mounts permanecen en el nodo que almacena los datos.
- CapRover fija las aplicaciones persistentes a un nodo. Añadir otro nodo no replica sus datos.
- Haz una copia de seguridad y migra los datos antes de cambiar la ubicación.
- Consulta [Aplicaciones persistentes en clústeres](multi-node.md).

<span id="source-scaling-manage-nodes"></span>

## Administrar nodos

Usa **Cluster → Nodes** y `docker node ls` en un manager para comprobar el estado y los roles. `docker service ps SERVICE_NAME` indica dónde se ejecutan las tareas de una aplicación y por qué alguna no arrancó.

- Antes de eliminar o drenar un nodo, identifica las aplicaciones que ejecuta y sus volúmenes y bind mounts locales.
- Las tareas stateless normalmente pueden reprogramarse si las imágenes están disponibles en el registry. Los datos persistentes no se trasladan automáticamente.
- Antes de cambiar la ubicación de una aplicación, haz backup y migra los datos de forma controlada.
- Mantén los puertos de gestión y overlay de Swarm restringidos a las IP de confianza.
- Si un nodo no puede unirse, comprueba Docker, que su Swarm está `inactive`, el acceso SSH desde el manager y la conectividad con el registry y los demás nodos.

<span id="source-scaling-persistent-apps"></span>

## Aplicaciones persistentes en un clúster

- CapRover suele limitar las aplicaciones con datos persistentes a una instancia en un nodo concreto.
- Un volumen Docker con el driver local predeterminado o un bind mount almacena datos en ese nodo. Otro nodo no verá automáticamente esos archivos.
- Para mover una aplicación persistente, haz backup, detén temporalmente las escrituras, restaura los datos en el destino, comprueba permisos, actualiza la ubicación y verifica la aplicación con una sola instancia.
- Conserva la copia anterior hasta comprobar el funcionamiento de la nueva.
- Si falla el nodo donde está fijada una aplicación, esta puede permanecer inaccesible hasta restaurar los datos en otro nodo.
- El almacenamiento compartido o externo necesita cumplir los requisitos de consistencia y escrituras concurrentes de la aplicación.
- Aumentar el número de instancias no proporciona almacenamiento compartido. Consulta [Almacenamiento compartido o externo](../data-persistence/shared-storage.md).

<span id="source-scaling-networking"></span>

## Red multinodo

- La red overlay de Docker Swarm permite que los servicios se comuniquen entre nodos.
- Entre nodos de confianza, permite `2377/tcp` (gestión), `7946/tcp` y `7946/udp` (comunicación), y `4789/udp` (overlay).
- Restringe esos puertos a las IP de los nodos. El tráfico web público sigue entrando por HTTP/HTTPS de CapRover.
- Los puertos públicos en modo `ingress` pueden utilizar el routing mesh de Swarm.
- En modo `host`, el puerto se publica en el nodo que ejecuta la tarea. La ubicación determina qué IP recibe las conexiones.
- Para conexiones internas a bases de datos, utiliza el nombre del servicio y el puerto del contenedor sin publicar un puerto en el host.

Si el nodo se une al clúster pero las tareas no se comunican, revisa los firewalls entre nodos, el estado de los servicios Docker y la pertenencia a la red antes de cambiar la configuración de las aplicaciones. Consulta la [referencia de puertos](../reference/ports.md).
