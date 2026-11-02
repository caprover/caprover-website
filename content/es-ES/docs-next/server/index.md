---
id: index
title: Administración del servidor
slug: /server
---

<span id="source-server-settings"></span>

## Ajustes del servidor

Usa el panel **Ajustes** área para gestionar el dominio raíz, contraseña de cuenta, actualizaciones y copias de seguridad de CapRover. Respalde el servidor antes de cambiar su dominio o actualización.

### Dominio de raíz

Apunte el registro de DNS Wildcard y el nombre de host de dashboard en el servidor antes de establecer el dominio raíz. Cambiarlo afecta a los nombres de host generados de aplicaciones y dashboard; comprobar DNS y renovar certificados HTTPS después del cambio. Si utiliza el registry autohospedado, retire o migra ese registro antes de cambiar el dominio. Consulta [DNS y dominios](../domains/index.md).

### Cuenta y recuperación

Cambia la contraseña inicial después de la instalación, asegura el panel con HTTPS y almacena las credenciales de recuperación de forma segura. Examen [Seguridad y acceso](index.md) y [Restauración](backup/index.md) antes del uso de producción.

<span id="source-server-security"></span>

## Seguridad y acceso

- Cambia la contraseña inicial de panel, habilita HTTPS para el dashboard, y restringe el acceso a puertos y SSH utilizando firewalls host y proveedor.
- Limite los puertos de Swarm a los nodos de grupos de confianza; vea [Configuración multinodo](../scaling/multi-node.md).
- Mantenga Docker y CapRover actualizado.

- Trate de tokens de despliegue, credenciales de registro, variables de entorno, archivos de respaldo y claves SSH como secretos.
- Utilizar credenciales separadas para la automatización, rotarlas cuando se expone, y revisar [CapRover Pro](index.md) opciones de dos factores si su instancia usa Pro.
- Una persona con acceso a la socket de Docker en el administrador tiene un control anfitriono amplio; otorgar la shell y el acceso de panel deliberadamente.

Respalde los datos de configuración y aplicación CapRover por separado y practique la restauración. Para problemas de acceso, consulte [Diagnósticos](../troubleshooting/diagnostics.md).

### Recuperar una contraseña de panel olvidado

- Utilice el flujo normal de cambio de contraseña del dashboard cuando aún puede iniciar sesión.
- Si usted ha perdido el acceso pero mantener el acceso de shell al administrador, la corriente [autenticador](https://github.com/caprover/caprover/blob/master/src/user/Authenticator.ts) Vuelve a `DEFAULT_PASSWORD` sólo cuando no existe contraseña guardada.
- Este procedimiento detiene brevemente CapRover y cambia su configuración guardada.
- Tenga una copia de seguridad reciente, y ejecutarlo sólo en su propio servidor:

1. Garantía `jq` se instala, graba la corriente `captain-captain` imagen de servicio, y respaldo `/captain/data/config-captain.json` fuera del servidor.
2. Preparar la configuración de reemplazo mientras el servicio se ejecuta:

   ```bash
   sudo cp -a /captain/data/config-captain.json /captain/data/config-captain.json.before-password-reset
   sudo jq 'del(.hashedPassword)' /captain/data/config-captain.json | sudo tee /captain/data/config-captain.json.new >/dev/null
   sudo jq empty /captain/data/config-captain.json.new
   ```

3. Elija una contraseña temporal de al menos ocho caracteres. Stop CapRover, instala el archivo preparado, establece la contraseña temporal, y reinicia el servicio:

   ```bash
   read -rsp 'Temporary password: ' CAPROVER_TEMP_PASSWORD; echo
   sudo docker service scale captain-captain=0
   sudo install -m 600 /captain/data/config-captain.json.new /captain/data/config-captain.json
   sudo docker service update --env-add "DEFAULT_PASSWORD=$CAPROVER_TEMP_PASSWORD" captain-captain
   sudo docker service scale captain-captain=1
   unset CAPROVER_TEMP_PASSWORD
   ```

4. Inicie sesión sobre HTTPS, cambie la contraseña temporal en Ajustes y verifique el nuevo login. Eliminar la variable de entorno temporal del servicio Docker con `sudo docker service update --env-rm DEFAULT_PASSWORD captain-captain`, luego verifique el login una vez más. El valor temporal puede ser visible en la inspección del servicio Docker hasta que se elimine. Mantenga la configuración de respaldo original hasta que la recuperación tenga éxito.

Si la autenticación de dos factores también bloquea el acceso, vea [Recuperación Pro OTP](index.md)Estos son pasos separados de recuperación.

<span id="source-server-pro"></span>

## CapRover Pro

- CapRover Pro añade funciones respaldadas por suscripción configuradas a través del dashboard con una tecla Pro API.
- Los controles disponibles incluyen autenticación de dos factores, alertas de inicio de sesión, avisos de éxito de build y avisos de falla de build, y acciones de correo electrónico o webhook.
- Compruebe la configuración Pro del dashboard para las opciones habilitadas en su suscripción.

- Configurar y probar un destino de alerta antes de confiar en él.
- Guarde su licencia Pro de forma segura.
- Cuando se habilita la autenticación de dos factores, un login interactivo CLI con su contraseña de dashboard también requiere el código de una sola vez actual:

```bash
CAPROVER_OTP_TOKEN=123456 caprover login
```

- Sustitución `123456` con un código actual.
- El CLI envía `CAPROVER_OTP_TOKEN` durante la autenticación basada en contraseña, incluyendo un login activado por `caprover deploy` cuando necesite un nuevo período de sesiones.
- Para la aplicación-scoped CI, utilice un [aplicación token](../deployments/ci-cd/index.md) en lugar de una contraseña dashboard y un OTP sensible al tiempo.
- Si pierdes acceso a tu contraseña única, un administrador con acceso al administrador puede ejecutar el script de recuperación dentro del contenedor CapRover:

```bash
docker exec -it "$(docker ps --filter name=captain-captain -q | head -n 1)" npm run disable-otp
```

Verifique primero el contenedor objetivo, use esto sólo para su propia instancia, luego inicie y configure nuevamente la autenticación de dos factores. Consulta [Solución de problemas](../troubleshooting/diagnostics.md).

**Alertas de correo electrónico:** Si necesita alertas en una bandeja de entrada diferente, inspeccione un remitente de alerta actual (históricamente `alerts@mail.pro.caprover.com`) y utilizar un filtro de correo electrónico / reglas de avance. Prueba el reenvío antes de confiar en él.

<span id="source-server-themes"></span>

## Temas de Dashboard

- El salpicadero **Temas** Los ajustes le permiten elegir un tema incorporado o crear uno personalizado.
- Contenido de tema personalizado es un objeto JavaScript pasado a Ant Design, en lugar de texto JSON.
- El editor proporciona `isDarkMode`, `darkAlgorithm`, y `defaultAlgorithm`:

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

- El **cabeza incrustada** campo puede cargar una fuente u otra marca de cabeza, por ejemplo `<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet" />`.
- El **configuración extra** campo acepta un objeto JavaScript como `{ siderTheme: 'dark' }` para una barra lateral oscura.
- Código de revisión antes de añadir scripts a la cabeza del panel.
- Guarda tu trabajo, selecciona el tema y verifica la legibilidad tanto en modos ligeros como en oscuros.
- Puede editar o eliminar temas personalizados; los temas incorporados están protegidos.

Los temas sólo afectan la apariencia de dashboard; el estilo de aplicación pertenece a la aplicación misma. El [definiciones temáticas incorporadas](https://github.com/caprover/caprover/tree/master/template/themes) y [Ant Design tema tokens](https://ant.design/docs/react/customize-theme) proporcionar más ejemplos.
