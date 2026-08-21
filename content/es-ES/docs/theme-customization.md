---
id: theme-customization
title: Temas personalizados
sidebar_label: Temas personalizados
---

_A partir de la versión 1.13_

CapRover ahora ofrece personalización de temas para brindarle más control sobre la apariencia de su panel. Al utilizar Ant Design para nuestro marco de interfaz de usuario, puede adaptar la interfaz de usuario para que coincida con sus preferencias. Para comenzar, consulte la [Ant Design documentación de personalización](https://ant.design/docs/react/customize-theme) para obtener orientación detallada. Al modificar variables como el color primario, el radio del borde y el tamaño de fuente, puede crear un tema personalizado que refleje su marca o gusto. ¡Feliz tematización!

![](/img/themes.gif)

**Algunas notas:**

- El tema Ant Design es un objeto javascript, no un JSON encadenado. Las claves no tienen comillas dobles.
- Hay 3 variables que se pasan al tema Ant Design: `isDarkMode`, `darkAlgorithm` y `defaultAlgorithm`. Por ejemplo puedes usar `colorBg: isDarkMode?'#010101':'#ffffff'`

### Otras personalizaciones

Además de las personalizaciones del tema Ant Design, hay otras dos formas de personalizar tu panel:

#### Incrustar elementos en `<head>`

Normalmente se utiliza para inyectar fuentes. Por ejemplo, el tema heredado utiliza:

```html
<link
  href="https://fonts.googleapis.com/css?family=Quicksand:300,500"
  rel="stylesheet"
/>
```

Para cargar la fuente Quicksand tal como se usa en el tema Ant Design personalizado. ¡Pero realmente puedes hacer cualquier cosa con esta caja!

Puede insertar JS personalizado que modifique completamente los elementos en el panel como desee. ¡Incluso puedes insertar etiquetas de Google Analytics!

#### CapRover configuraciones adicionales:

Hay algunas personalizaciones que no se pueden modificar con Ant Design de forma predeterminada. Esas personalizaciones se pueden modificar a través del CapRover cuadro de configuración adicional.

Actualmente, el único parámetro aquí es el tema de la barra lateral en el tablero (claro u oscuro), pero podría haber más en el futuro.

```js
{
  siderTheme: "dark";
}
```



### ¡Envía tus temas personalizados!

Si ha creado un nuevo tema divertido, no dude en enviar una solicitud de extracción para incluirlo en [nuestros temas integrados](https://github.com/caprover/caprover/tree/master/template/themes)
