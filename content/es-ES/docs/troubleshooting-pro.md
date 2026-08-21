---
id: troubleshooting-pro
title: Solución de problemas de CapRover Pro
sidebar_label: Solución de problemas (Pro)
---

<br/>

Esta sección solo es aplicable a suscriptores de CapRover Pro (planes pagos). Puede suscribirse a planes pagos y beneficiarse de funciones adicionales como notificaciones de estado de compilación, actualizaciones de seguridad como alertas de inicio de sesión y autenticación de dos factores.

## Restablecer OTP (autenticación de dos factores)

Es posible que tengas que restablecer la autenticación de dos factores en casos excepcionales como:

- Cuando https://pro.caprover.com está inactivo y no puedes acceder a tu instancia
- Cuando has perdido el acceso a la aplicación de autenticación

En estos casos, todo lo que necesita hacer es simplemente borrar las configuraciones profesionales y degradar temporalmente su servidor a una versión no paga. Puedes hacerlo eliminando el contenido `pro` en `/captain/data/config-captain.json`

El siguiente script auxiliar hará exactamente eso:

```bash
docker service scale captain-captain=0 && \
docker run -it --rm -v /captain:/captain  caprover/caprover /bin/sh -c "wget https://raw.githubusercontent.com/caprover/caprover/master/dev-scripts/clear-pro-config.js ; node clear-pro-config.js ;" && \
docker service scale captain-captain=1 && \
echo "OKAY"

```

**Actualización:**

A partir de v1.12.0, puede ejecutar el siguiente script:

```bash
docker exec -it $(docker ps --filter name=captain-captain -q) npm run disable-otp
```

## Implementar con OTP habilitado

Cuando tiene OTP habilitado, no puede implementar usando `caprover deploy` normal, ya que requiere token 2FA (`enter OTP token as well`). En su lugar, deberías utilizar tokens de aplicación:

```bash
caprover deploy --caproverUrl https://captain.domain.com --appToken 123456123456123456 --appName my-app -b main
```

Puede habilitar el token de aplicación desde la pestaña Implementación. Alternativamente, puede utilizar el siguiente formato (no recomendado):

```bash
CAPROVER_OTP_TOKEN=123456; caprover login

## or

CAPROVER_OTP_TOKEN=123456; caprover deploy
```

## Establecer una dirección de correo electrónico específica para las alertas

Actualmente, cambiar los correos electrónicos de notificación no es una función integrada. Sin embargo, una de las muchas razones por las que elegimos a Google como nuestro proveedor de autenticación es que en Gmail puedes configurar fácilmente filtros y reenviar correos electrónicos específicos a una dirección de correo electrónico diferente.

Simplemente busque `from: alerts@mail.pro.caprover.com` y cree un filtro, luego reenvíe los resultados a otra dirección de correo electrónico.

![gmail-instrucción-1](/img/docs/gmail-1.png)
![gmail-instrucción-2](/img/docs/gmail-2.png)

## Soporte por correo electrónico

Nuestro plan Pro pago incluye soporte por correo electrónico SLA las 24 horas. Puede enviarnos un correo electrónico al `pro.support at/caprover/dot/com` para obtener ayuda. Asegúrese de utilizar el mismo correo electrónico que utilizó para la compra.
