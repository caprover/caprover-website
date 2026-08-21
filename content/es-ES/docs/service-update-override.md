---
id: service-update-override
title: Anulación de actualización de servicio
sidebar_label: Anulación de actualización de servicio
---

**Disponible a partir de v1.8.0**

Aunque [script previo a la implementación](pre-deploy-script.md) proporciona un gran poder para personalizar el servicio, a veces tiene demasiado poder para lo que necesita hacer.

Por ejemplo, Docker le permite definir volúmenes de solo lectura, o UDP mapeo de puertos solo y muchos otros indicadores de personalización a través del [comando de actualización de la ventana acoplable](https://docs.docker.com/engine/reference/commandline/service_update/). No todas estas banderas se transfieren a CapRover ya que rara vez se usan. Sin embargo, hay situaciones en las que desea utilizar algunas de estas banderas. Para estos casos, puede definir una anulación de servicio de contenido JSON o YAML.

Cada vez que implementas una nueva versión o cambias un parámetro de configuración en la aplicación, tu servicio pasa por un proceso de actualización:

1. CapRover actualiza los campos que están configurados explícitamente en CapRover UI (variaciones de entorno, recuento de instancias, etc.). 
2. Si "Anulación de actualización de servicio" está presente, CapRover anula el resultado del paso anterior con el contenido anulado.
3. Si hay un "script previo a la implementación", CapRover ejecuta el script previo a la implementación. 
4. El resultado de los 3 pasos anteriores se pasa al Docker API para que Docker pueda actualizar el servicio bajo el capó.

## Esquema

Para la "Anulación de actualización de servicio", puede usar YAML o JSON. El esquema debe coincidir con el [objeto Service Update](https://docs.docker.com/reference/api/engine/version/v1.44/#tag/Service/operation/ServiceUpdate) de Docker Engine API v1.44. El siguiente YAML es un ejemplo parcial; la API admite parámetros adicionales.

```yaml
TaskTemplate:
  ContainerSpec:
    Labels:
      some.label: some.value
    Image: busybox
    Command:
      - ./mycommand.sh
    Hostname: my.domain.com
    CapabilityAdd:
      - CAP_NET_ADMIN
    DNSConfig:
      Nameservers:
         - 8.8.8.8 
         - 8.8.4.4 
    Mounts:
      - Type: bind
        Source: /host/directory
        Target: /some/path/in/container
        ReadOnly: true
    Args:
      - top
  Resources:
    Limits:
      MemoryBytes: 104857600
      NanoCPUs: 2000000000
    Reservations:
      MemoryBytes: 104857600
      NanoCPUs: 2000000000
  RestartPolicy:
    Condition: any
    MaxAttempts: 0
  Placement:
    Constraints:
      - node.id==2ivku8v2gvtg4
  Networks:
    - Target: captain-overlay-network
  LogDriver:
    Name: json-file
    Options:
      max-size: 512m
  ForceUpdate: 0
Mode:
  Replicated:
    Replicas: 1
UpdateConfig:
  Parallelism: 2
  Delay: 1000000000
  FailureAction: pause
  Monitor: 15000000000
  MaxFailureRatio: 0.15
  Order: start-first
RollbackConfig:
  Parallelism: 1
  Delay: 1000000000
  FailureAction: pause
  Monitor: 15000000000
  MaxFailureRatio: 0.15
  Order: start-first
EndpointSpec:
  Mode: vip
  Ports:
    - Name: something
      Protocol: tcp
      TargetPort: 80
      PublishedPort: 8080
      PublishMode: host
```


## Casos de uso de muestra

Un caso de uso común es limitar el uso de recursos por parte de un servicio en particular. En ese caso, puedes hacer algo como:

```
TaskTemplate:
  Resources:
    Limits:
      MemoryBytes:	104857600
      NanoCPUs: 2000000000
```

Esto impondrá un límite de 2 CPU y 100 MB RAM de uso en su servicio. Puedes confirmar esto ejecutando
```
docker service inspect your-app-name --pretty
```

Use `docker service ls` para confirmar el nombre físico del servicio. Las aplicaciones actualizadas desde versiones de CapRover anteriores a 1.15 pueden conservar la forma `srv-captain--your-app-name`.

Otro caso de uso es cuando desea personalizar el comando:
```yaml
TaskTemplate:
  ContainerSpec:
    Command: "./mycommand.sh"
```

Si su contenedor necesita agregar algo de CAP_ADD al servicio Docker, puede hacer lo siguiente:

```yaml
TaskTemplate:
  ContainerSpec:
    CapabilityAdd:
      - CAP_SYS_ADMIN
      - CAP_NET_ADMIN
```



## Volver al valor predeterminado

Una nota importante es que CapRover NO modifica ningún indicador existente que no controle. Las banderas que controla CapRover son: env vars, ports, image y algunos otros.

Si anula una propiedad que no está controlada por CapRover, como el límite CPU anterior, incluso si elimina la anulación, la configuración no se revertirá. Esto se debe a que ya se configuró en el motor Docker.

Entonces, en lugar de eliminar la anulación, cámbiela a otro valor y luego elimínela. Por ejemplo, si desea eliminar la limitación de CPU y RAM:
- Primero, configúrelo en un valor alto, por ejemplo, RAM a 50 GB y CPU a 20 CPU.
- Luego, puedes eliminar la anulación.


Por supuesto, como alternativa, puedes eliminar el servicio y crear uno nuevo.
