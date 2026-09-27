---
id: themes
title: Dashboard Themes
slug: /server/themes
---

The dashboard's **Themes** settings let you choose a built-in theme or create a custom one. Custom theme content is a JavaScript object passed to Ant Design, rather than JSON text. The editor provides `isDarkMode`, `darkAlgorithm`, and `defaultAlgorithm`:

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

The **head embed** field can load a font or other head markup, for example `<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet" />`. The **extra configuration** field accepts a JavaScript object such as `{ siderTheme: 'dark' }` for a dark sidebar. Review code before adding scripts to the dashboard head. Save your work, select the theme, and check readability in both light and dark modes. You can edit or delete custom themes; built-in themes are protected.

Themes only affect the dashboard appearance; application styling belongs in the application itself. The [built-in theme definitions](https://github.com/caprover/caprover/tree/master/template/themes) and [Ant Design theme tokens](https://ant.design/docs/react/customize-theme) provide more examples.
