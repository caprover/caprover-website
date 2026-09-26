---
id: themes
title: Dashboard Themes
slug: /server/themes
---

The dashboard's **Themes** settings let you choose a built-in theme or create a custom one. Custom theme content is a JavaScript object passed to Ant Design, rather than JSON text. For example, a conditional background color can use `isDarkMode`:

```javascript
{ token: { colorBgBase: isDarkMode ? '#101010' : '#ffffff' } }
```

The theme editor also provides a **head embed** field for fonts or other head markup and an **extra configuration** field for CapRover-specific settings, such as `{ siderTheme: 'dark' }`. Review code before adding scripts to the dashboard head. Save your work, select the theme, and check readability in both light and dark modes. You can edit or delete custom themes; built-in themes are protected.

Themes only affect the dashboard appearance; application styling belongs in the application itself. See the [existing theme customization guide](/docs/theme-customization) and [Ant Design theme tokens](https://ant.design/docs/react/customize-theme) for more examples.
