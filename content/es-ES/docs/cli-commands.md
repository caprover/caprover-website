---
id: cli-commands
title: Comandos CLI
sidebar_label: Comandos CLI
---

<br/>

Puede utilizar esta herramienta CLI para implementar sus aplicaciones. Antes que nada, instale la herramienta CLI usando npm:
```
npm install -g caprover
```

### Configuración del servidor

Lo primero que debe hacer es configurar su servidor Captain. Puede hacerlo visitando `HTTP://IP_ADDRESS_OF_SERVER:3000` en su navegador o la forma recomendada, que es la herramienta de línea de comandos. Ejecución sencilla
```
caprover serversetup
```

Siga los pasos según las instrucciones, ingrese IP dirección del servidor. Ingrese el dominio raíz que se utilizará con esta instancia Captain. Si no sabe qué es el dominio raíz Captain, visite www.caprover.com para obtener documentación. Este es un paso muy crucial. Después de eso, se le pedirá que ingrese su dirección de correo electrónico. Debe ser una dirección de correo electrónico válida, ya que se utilizará en su certificado SSL. Después de habilitar HTTPS, se le pedirá que cambie su contraseña. Y... ¡Ya terminaste! Vaya a la sección Implementar a continuación para leer más sobre la implementación de aplicaciones.


### Acceso

*Si has realizado el proceso de "Configuración del servidor" a través de la línea de comando. Puede omitir el paso "Iniciar sesión" porque la "configuración del servidor" lo inicia automáticamente como último paso de la configuración.*

Lo primero que debe hacer es iniciar sesión en su servidor Captain. Lo recomendable es que en este punto ya tengas configurado tu HTTPS. No se recomienda iniciar sesión de forma insegura y simple HTTP.

Para iniciar sesión en el servidor, simplemente ejecute la siguiente línea y responda las preguntas.

```bash
caprover login
```

Si la operación finaliza exitosamente, aparecerá un mensaje de éxito.

NOTA: Puede iniciar sesión en varios servidores Captain al mismo tiempo. Esto es particularmente útil si tiene servidores de prueba y de producción separados.

### Desplegar

Para implementar su aplicación, primero debe crear un archivo captain-definition y colocarlo en la raíz de la carpeta de su proyecto. En el caso de una aplicación nodejs, esta se ubicaría en la misma carpeta que su paquete.json.

Un archivo captain-definition simple para una aplicación nodejs es:

```
 {
  "schemaVersion": 2,
  "templateId": "node/24"
 }
```

Consulte [Captain Archivo de definición](captain-definition-file.md) para obtener más detalles sobre el archivo de definición Captain.

Después de asegurarse de que este archivo existe, ejecute el siguiente comando y responda las preguntas formuladas:

```bash
caprover deploy
```

Luego verá cómo se carga su aplicación y, luego, cómo se construye su aplicación. Tenga en cuenta que el proceso de compilación puede tardar varios minutos, así que tenga paciencia.

Para usar los valores ingresados ​​previamente para el directorio actual, sin que se le vuelva a preguntar, use la opción `-d`:

```bash
caprover deploy -d
```

Alternativamente, puede usar el modo sin estado y proporcionar la información del servidor CapRover en línea:
```bash
caprover deploy -u https://captain.root.domain.com -p password -b branchName -a app-name
```

Esto puede resultar útil si desea integrar la canalización CI/CD.

#### Opciones:
Esos parámetros están disponibles:
- `-d, --default`: Utiliza valores ingresados previamente para el directorio actual. No se consideran otras opciones.
- `-c, --configFile <file>`: especifica un archivo de configuración que se utilizará para la configuración de implementación.
- `-u, --caproverUrl <url>`: Establece la máquina CapRover URL a la que se realizará el despliegue. Este URL suele tener el formato [http[s]://][captain.].your-captain-root.domain.
- `-p, --caproverPassword <password>`: La contraseña de la máquina CapRover. Esta opción aparece cuando se proporciona un URL y no se utiliza un token de aplicación.
- `-n, --caproverName <name>`: el nombre de la máquina CapRover en la que desea implementar. Esto se puede seleccionar de una lista de máquinas registradas.
- `-a, --caproverApp <app>`: especifica el nombre de la aplicación en la máquina CapRover en la que está implementando. Esto se selecciona de una lista de aplicaciones disponibles en la máquina.
- `-b, --branch <branch>`: Especifica la rama Git que se implementará. Tenga en cuenta que no se incluirán los archivos no confirmados y ignorados por git.
- `-t, --tarFile <tarFile>`: especifica la ruta a un archivo tar que debe incluir un archivo captain-definition para la implementación.
- `-i, --imageName <image>`: especifica una imagen Docker que se implementará. La imagen debe existir en el servidor o ser accesible a través de repositorios públicos o privados a los que CapRover pueda acceder.
- `--appToken <token>`: un token opcional para la autenticación a nivel de aplicación, si es necesario.


### Lista de servidores registrados

Para ver una lista de los servidores en los que está conectado actualmente, ejecute la siguiente línea:

```bash
caprover list
```

### Cerrar sesión

Ejecute el siguiente comando:

```bash
caprover logout
```
