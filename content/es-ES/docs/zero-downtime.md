---
id: zero-downtime
title: Implementaciones sin tiempo de inactividad
sidebar_label: Tiempo de inactividad cero
---

#### Ejemplo:

Si prefiere aprender de un ejemplo, consulte [este repositorio de github](https://github.com/caprover/zero-downtime-example).

Este repositorio contiene una aplicación de ejemplo que tarda 15 segundos en iniciarse. Pero, al implementar esta aplicación en cualquier instancia CapRover, no verá ningún error 502.

Tenga en cuenta que debe asegurarse de que, al crear una aplicación, **NO** marque la casilla de verificación "datos persistentes".

### Comprender el desafío

Durante el proceso de implementación, cuando se implementa una nueva imagen Docker, puede haber una interrupción temporal del servicio (error 502 durante la implementación). Esto suele ocurrir porque el nuevo contenedor puede tardar algún tiempo (por ejemplo, 30 segundos) en estar completamente operativo. Durante este tiempo, si el servicio recibe tráfico, Nginx podría devolver un error 502 Bad Gateway, lo que indica que no puede recibir una respuesta del servicio backend.

### El papel de los health checks de Docker

Los health checks de Docker son una funcionalidad esencial para reducir el downtime provocado por un deployment. Permiten especificar en el Dockerfile un comando que comprueba periódicamente el estado de un contenedor. Docker utiliza esta información para gestionar el ciclo de vida del contenedor según su estado.

### Implementación de controles de estado en CapRover

Para integrar controles de estado en su proceso de implementación CapRover, siga estos pasos:

**Paso 1:** Defina el control de salud en su Dockerfile
Modifique su Dockerfile para incluir una instrucción `HEALTHCHECK`. Esta instrucción indica Docker cómo probar el contenedor para comprobar si todavía funciona. Puede ser un comando que verifica el estado interno del contenedor o realiza una solicitud a un punto final HTTP.

```dockerfile
HEALTHCHECK --interval=30s --timeout=30s --retries=3 \
 CMD curl -f http://127.0.0.1:3000/ || exit 1
```

En este ejemplo, curl solicitará la raíz URL del contenedor cada 30 segundos. Si curl sale con un estado distinto de cero más de tres veces seguidas (como se define en
`--retries`), el contenedor se considera no saludable.

**Paso 2:** Implementar y configurar en CapRover
Una vez que su Dockerfile esté actualizado, implemente su aplicación a través de CapRover. La plataforma, que utiliza Docker Swarm, reconocerá las instrucciones de verificación de estado y gestionará la implementación en consecuencia.

El comportamiento predeterminado de CapRover, con Docker Swarm, esperará a que el nuevo contenedor pase su verificación de estado antes de enrutar el tráfico hacia él. Esto evita efectivamente enrutar solicitudes a contenedores que no están listos para manejarlas, evitando así errores 502.

### ¿Cuándo no funciona?

Si su aplicación no usa un volumen, CapRover usa la estrategia `start-first` al actualizar los contenedores. Esto significa que la nueva versión de su contenedor estará operativa antes de que se elimine la anterior. Esto debería proporcionarle un tiempo de inactividad prácticamente nulo.

Esta estrategia no se aplica intencionalmente a aplicaciones con volúmenes adjuntos. Esto se debe a que si varias instancias del mismo servicio intentan acceder al mismo archivo, se producirán fallas y daños en los datos. Para aplicaciones con volúmenes (**datos persistentes**), CapRover usuario `stop-first` estrategia. Esto significa que el contenedor antiguo se detiene primero, antes de que se inicie el nuevo. Esto resulta en cierta cantidad de tiempo de inactividad.

Si su aplicación tiene datos persistentes, aún puede forzar la estrategia `start-first`, pero tenga en cuenta que podría dañar los datos, ya que el contenedor antiguo y el nuevo podrían intentar escribir el mismo archivo al mismo tiempo. Si aún desea continuar con esto, simplemente puede ingresarlo en su [anulación de servicio](service-update-override.md)

```yaml
UpdateConfig:
  Parallelism: 2
  Delay: 1000000000
  FailureAction: pause
  Monitor: 15000000000
  MaxFailureRatio: 0.15
  Order: start-first
```
