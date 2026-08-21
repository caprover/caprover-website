---
id: theme-customization
title: Custom Themes
sidebar_label: Custom Themes
---

_As of version 1.13_

CapRover now offers theme customization to give you more control over the look and feel of your dashboard. Utilizing Ant Design for our front-end framework, you can tailor the UI to match your preferences. To get started, refer to the [Ant Design customization documentation](https://ant.design/docs/react/customize-theme) for detailed guidance. By tweaking variables such as primary color, border radius, and font size, you can create a personalized theme that reflects your brand or taste. Happy theming!

![](/img/themes.gif)

**A few notes:**

- Ant Design theme is a javascript object, not a stringified JSON. The keys do not have double quotes.
- There are 3 variables that are passed to Ant Design theme: `isDarkMode`, `darkAlgorithm` and `defaultAlgorithm`. For example you can use `colorBg: isDarkMode?'#010101':'#ffffff'`

### Other customizations

Other than Ant Design theme customizations, there are two other ways you can customize your dashboard:

#### Embed elements into <head>

This is typically used to inject fonts. For example, the legacy theme, uses:

```html
<link
  href="https://fonts.googleapis.com/css?family=Quicksand:300,500"
  rel="stylesheet"
/>
```

To load Quicksand font as it's used in the customized Ant Design theme. But really, you can do anything with this box!

You can insert custom JS that completely modifies the elements on the dashboard however you want. You can even insert Google analytics tags!

#### CapRover extra configurations:

There are some customizations that are not modifiable by Ant Design by default. Those customizations can be modified through CapRover extra configuration box.

Currently, the only parameter here is the theme of side bar on the dashboard (light or dark), but there might be more in the future.

```js
{
  siderTheme: "dark";
}
```



### Submit your custom themes!

If you have built a new fun theme, feel free to submit a pull request to include it in [our built-in themes](https://github.com/caprover/caprover/tree/master/template/themes)
