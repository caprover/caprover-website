---
id: openstack
title: Configurando CapRover con OpenStack
sidebar_label: OpenStack
---

## ¿Por qué OpenStack?

OpenStack es la alternativa más popular a los estándares de nube propietarios de infraestructura como servicio (IaaS).
Tanto los grandes proveedores de la nube como AWS y Azure como algunos más pequeños como Hetzner tienen sus propias API distintas.
configuraciones y convenciones de nomenclatura para implementar recursos.
OpenStack le permite implementar la misma manera en cualquier nube que implemente el estándar OpenStack (o incluso implementar la suya propia).
escapando así del bloqueo del proveedor.

## Configurar un proveedor OpenStack

Varios proveedores de nube admiten OpenStack, incluidos Infomaniak, VEXXHOST, OVHcloud, SharkTech y más.

De los proveedores que he visto, Infomaniak tiene la mejor [documentación](https://docs.infomaniak.cloud/).

Debes seguir las instrucciones de tu proveedor para obtener el archivo cloud.yaml para conectar el OpenStack CLI
al proyecto de la nube.

Aquí tienes un breve resumen de los pasos para Infomaniak.
Consulte su [documentación](https://docs.infomaniak.cloud/documentation/00.getting-started/01.Create_new_project/) para obtener más detalles, incluidas capturas de pantalla.
Los pasos para otros proveedores deberían ser similares.

1. Cree un nuevo proyecto en su panel de nube pública. Llame al proyecto algo así como `caprover-prod`.
2. Cuando se le solicite, genere y establezca una contraseña para el usuario OpenStack.
3. Vaya a "Administrar usuarios" del proyecto. Haga clic en el menú desplegable junto al único usuario (comenzando con PCU-...) y descargue
    el archivo nubes.yaml.
4. Mueva `clouds.yaml` a una ubicación [donde el cliente OpenStack podrá encontrarlo](https://docs.openstack.org/python-openstackclient/latest/configuration/index.html), es decir.
    `.config/openstack/clouds.yaml` en su directorio de inicio.
    Si ya configuró el archivo anteriormente, copie y agregue la configuración a su archivo existente.
5. Abra su archivo `clouds.yaml` y cambie el nombre de la nube de `PCP-...` a algo más legible para humanos como
    `infomaniak-prod`. Esto le permitirá seguir agregando a su archivo a medida que agregue más entornos o incluso otros OpenStack
    proveedores.
6. Inserte también la contraseña que generó en el paso 2 en el archivo.

## Instala el OpenStack CLI y valida la conexión
1. Instale el cliente de línea de comando OpenStack.
    Las [instrucciones oficiales OpenStack](https://docs.openstack.org/newton/user-guide/common/cli-install-openstack-command-line-clients.html)
    instalaría el cliente a través de `pip`, pero es mucho más limpio usarlo [pipx](https://pipx.pypa.io/stable/)
    en lugar de ello, para evitar contaminar el espacio global de su paquete Python:
    ```
    pip install pipx
    pipx install python-openstackclient
    pipx inject python-openstackclient python-heatclient
    ```
2. Validar la conexión con el comando:
    ```
    openstack --os-cloud mycloud project list
    ```
(Nota: en este y los siguientes comandos, reemplace `mycloud` con el nombre real que configuró en nubes.yaml,
    como `vexxhost-dev` o `infomaniak-prod`).
    Esto debería mostrar el nombre de su proyecto predeterminado.

## Implementar el archivo de plantilla OpenStack Heat

1. Necesitará generar una clave para poder ingresar SSH a su servidor CapRover si es necesario.
    Puedes crear la carpeta `~/.ssh/openstack` o almacenar tu clave donde quieras.
    ```
    openstack --os-cloud mycloud keypair create caprover > ~/.ssh/openstack/mycloud.priv
    chmod 600 ~/.ssh/openstack/mycloud.priv
    ```
2. Muchos proveedores OpenStack proporcionan un conjunto predeterminado de imágenes de VM.
    Consulta las imágenes disponibles con
    ```
    openstack --os-cloud mycloud image list
    ```
Se recomienda obtener la última versión de Ubuntu LTS.
    También puedes subir tu propia imagen siguiendo las instrucciones.
    [aquí](https://docs.openstack.org/heat/latest/getting_started/create_a_stack.html#preparing-to-create-a-stack).
3. Consulta los sabores disponibles con
    ```
    openstack --os-cloud mycloud flavor list
    ```
3. Verifique las redes disponibles con
    ```
    openstack --os-cloud mycloud network list
    ```
4. Finalmente, junta todas las piezas para desplegar CapRover. Asegúrese de reemplazar los valores del marcador de posición por los suyos propios.
    ```
    openstack --os-cloud mycloud stack create -t https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/openstack/single-instance.yml --parameter image_id=<Ubuntu image ID> --parameter instance_type=<flavor> --parameter network=<network> caprover
    ```
Por ejemplo, en Infomaniak funciona lo siguiente:
    ```
    openstack --os-cloud infomaniak-dev stack create -t https://raw.githubusercontent.com/caprover/caprover/master/se
tup/openstack/single-instance.yml --parameter image_id="Ubuntu 22.04 LTS Jammy Jellyfish" --parameter instance_type=a1-ram2-disk20-perf1 --parameter network=ext-net1 caprover
    ```

## Validar la implementación
1. Inicie sesión en la interfaz de usuario web del panel OpenStack.
2. Instancias abiertas. Deberías ver la instancia `caprover-caprover_manager-...`. Copie su dirección IP.
3. Debería poder ver el panel CapRover en su navegador en `<IP address>:3000`.
    A partir de este punto, debería poder terminar de configurar CapRover siguiendo las instrucciones en
    [Comenzando](https://caprover.com/docs/get-started.html)
4. También puedes ingresar SSH a la instancia con el comando:
    ```
    ssh -i ~/.ssh/openstack/mycloud-prod.priv -o StrictHostKeyChecking=accept-new ubuntu@<CapRover manager IP>
    ```
Una vez dentro, puede explorar el resultado del proceso de instalación desde la plantilla de Heat con el comando
    `sudo less /var/log/cloud-init-output.log`.
