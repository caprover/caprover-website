---
id: index
title: Administración del servidor
slug: /server
---

<span id="source-server-settings"></span>

## Ajustes del servidor

Desde **Settings** en el dashboard puedes administrar el dominio raíz, la contraseña de la cuenta, las actualizaciones y los backups de CapRover. Haz un backup antes de cambiar el dominio o actualizar el servidor.

### Dominio raíz

Antes de configurar el dominio raíz, apunta el registro DNS wildcard y el hostname del dashboard al servidor. Cambiar el dominio raíz modifica los hostnames generados para las aplicaciones y el dashboard; comprueba el DNS y renueva los certificados HTTPS después del cambio. Si utilizas el registry autohospedado, retíralo o mígralo antes de cambiar el dominio. Consulta [DNS y dominios](../domains/index.md).

### Cuenta y recuperación

Cambia la contraseña inicial después de instalar CapRover, protege el dashboard con HTTPS y guarda las credenciales de recuperación de forma segura. Revisa [Seguridad y acceso](index.md) y [Backup y restauración](backup/index.md) antes de utilizarlo en producción.

<span id="source-server-security"></span>

## Seguridad y acceso

- Cambia la contraseña inicial del dashboard, habilita HTTPS y restringe los puertos y SSH mediante los firewalls del host y del proveedor.
- Permite los puertos de Swarm solo entre nodos de confianza. Consulta [Configuración multinodo](../scaling/multi-node.md).
- Mantén Docker y CapRover actualizados.

- Trata los tokens de despliegue, credenciales de registry, variables de entorno, archivos de backup y claves SSH como secretos.
- Utiliza credenciales independientes para automatizaciones, rótalas si se exponen y consulta las opciones de 2FA de [CapRover Pro](index.md) si tu instalación utiliza Pro.
- Quien tiene acceso al socket Docker del nodo manager puede controlar gran parte del host. Concede los accesos al servidor y al dashboard con cuidado.

Haz backups independientes de la configuración de CapRover y de los datos de las aplicaciones, y prueba las restauraciones. Si tienes problemas de acceso, consulta [Diagnósticos](../troubleshooting/diagnostics.md).

### Recuperar una contraseña olvidada del dashboard

- Si todavía puedes iniciar sesión, utiliza la opción normal de cambio de contraseña del dashboard.
- Si has perdido el acceso al dashboard, pero conservas acceso shell al manager, el [autenticador](https://github.com/caprover/caprover/blob/master/src/user/Authenticator.ts) actual usa `DEFAULT_PASSWORD` únicamente cuando no existe un hash de contraseña guardado.
- Este procedimiento detiene CapRover brevemente y modifica su configuración guardada.
- Asegúrate de tener un backup reciente y ejecútalo solo en tu propio servidor:

1. Comprueba que `jq` esté instalado, anota la imagen actual del servicio `captain-captain` y guarda una copia de `/captain/data/config-captain.json` fuera del servidor.
2. Prepara una configuración de reemplazo mientras el servicio sigue funcionando:

   ```bash
   sudo cp -a /captain/data/config-captain.json /captain/data/config-captain.json.before-password-reset
   sudo jq 'del(.hashedPassword)' /captain/data/config-captain.json | sudo tee /captain/data/config-captain.json.new >/dev/null
   sudo jq empty /captain/data/config-captain.json.new
   ```

3. Elige una contraseña temporal de al menos ocho caracteres. Detén CapRover, sustituye la configuración, establece esa contraseña y reinicia el servicio:

   ```bash
   read -rsp 'Temporary password: ' CAPROVER_TEMP_PASSWORD; echo
   sudo docker service scale captain-captain=0
   sudo install -m 600 /captain/data/config-captain.json.new /captain/data/config-captain.json
   sudo docker service update --env-add "DEFAULT_PASSWORD=$CAPROVER_TEMP_PASSWORD" captain-captain
   sudo docker service scale captain-captain=1
   unset CAPROVER_TEMP_PASSWORD
   ```

4. Inicia sesión por HTTPS, cambia la contraseña temporal en Settings y comprueba que funciona. Elimina la variable de entorno temporal del servicio Docker con `sudo docker service update --env-rm DEFAULT_PASSWORD captain-captain` y verifica el acceso una vez más. Hasta que la elimines, la contraseña temporal podría aparecer en la inspección del servicio Docker. Conserva la configuración original hasta completar la recuperación.

Si también has perdido acceso a 2FA, consulta [Recuperación de OTP de Pro](index.md). Son procedimientos independientes.

<span id="source-server-pro"></span>

## CapRover Pro

- CapRover Pro incluye funciones asociadas a una suscripción, configuradas desde el dashboard con una clave de API Pro.
- Entre ellas están la autenticación de dos factores, las alertas de inicio de sesión, los avisos de builds correctos o fallidos y las acciones de email o webhook.
- Consulta los ajustes de Pro en el dashboard para ver qué opciones incluye tu suscripción.

- Configura y prueba el destino de alertas antes de utilizarlo en producción.
- Protege tu clave Pro.
- Con 2FA activo, iniciar sesión en la CLI con la contraseña del dashboard requiere también el código OTP actual:

```bash
CAPROVER_OTP_TOKEN=123456 caprover login
```

- Sustituye `123456` por un código válido en ese momento.
- La CLI envía `CAPROVER_OTP_TOKEN` durante la autenticación por contraseña, incluida la iniciada por `caprover deploy` cuando necesita una sesión nueva.
- Para CI con permisos limitados a una aplicación, utiliza un [token de despliegue de aplicación](../deployments/ci-cd/index.md) en vez de una contraseña del dashboard y un OTP que caduca.
- Si pierdes el segundo factor, un administrador con acceso shell al manager puede ejecutar el script de recuperación dentro del contenedor de CapRover:

```bash
docker exec -it "$(docker ps --filter name=captain-captain -q | head -n 1)" npm run disable-otp
```

Comprueba primero que el contenedor elegido sea el correcto. Utiliza este procedimiento únicamente en tu propia instalación y vuelve a configurar 2FA después de entrar. Consulta [Problemas con Pro](../troubleshooting/diagnostics.md).

**Alertas por email de Pro:** si necesitas recibir alertas en otra dirección, identifica el remitente actual (históricamente `alerts@mail.pro.caprover.com`) y configura un filtro o una regla de reenvío. Prueba el reenvío antes de depender de él.

<span id="source-server-themes"></span>

## Temas del dashboard

Desde **Themes** puedes seleccionar un tema integrado o crear uno personalizado.

- El contenido de un tema personalizado es un objeto JavaScript que se pasa a Ant Design, no texto JSON.
- El editor ofrece las variables `isDarkMode`, `darkAlgorithm` y `defaultAlgorithm`:

```javascript
{
  algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
  token: {
    colorPrimary: '#2769c5',
    colorBgBase: isDarkMode ? '#101010' : '#ffffff',
    borderRadius: 6,
    fontSize: 14
  }
}
```

- El campo **head embed** permite incluir una fuente u otro contenido del encabezado, por ejemplo `<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet" />`.
- El campo **extra configuration** acepta un objeto JavaScript como `{ siderTheme: 'dark' }` para utilizar una barra lateral oscura.
- Revisa cualquier código antes de insertar scripts en el encabezado del dashboard.
- Guarda los cambios, selecciona el tema y comprueba que sea legible tanto en modo claro como oscuro.
- Puedes editar o eliminar temas personalizados; los temas integrados están protegidos.

Los temas solo modifican la apariencia del dashboard. El diseño visual de cada aplicación se configura dentro de ella. Consulta las [definiciones de temas integrados](https://github.com/caprover/caprover/tree/master/template/themes) y los [tokens de temas de Ant Design](https://ant.design/docs/react/customize-theme) para más ejemplos.
