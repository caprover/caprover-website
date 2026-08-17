---
id: theme-customization
title: 自定义主题
sidebar_label: 自定义主题
---

_从 1.13 版本开始_

CapRover 现在提供主题自定义，让你可以更好地控制控制台的外观。我们的前端框架使用 Ant Design，你可以把 UI 调整成符合自己偏好的样子。开始之前，请参考 [Ant Design customization documentation](https://ant.design/docs/react/customize-theme) 获取详细说明。通过调整主色、圆角和字号等变量，你可以创建一个体现品牌或个人品味的个性化主题。

![](/img/themes.gif)

**几点说明：**

- Ant Design 主题是一个 javascript 对象，不是字符串化的 JSON。键没有双引号。
- 有 3 个变量会传给 Ant Design 主题：`isDarkMode`、`darkAlgorithm` 和 `defaultAlgorithm`。例如，你可以使用 `colorBg: isDarkMode?'#010101':'#ffffff'`

### 其他自定义

除了 Ant Design 主题自定义，还有两种方式可以自定义控制台：

#### 把元素嵌入 <head>

这通常用于注入字体。例如，旧版主题使用：

```html
<link
  href="https://fonts.googleapis.com/css?family=Quicksand:300,500"
  rel="stylesheet"
/>
```

以加载自定义 Ant Design 主题中使用的 Quicksand 字体。但实际上，你可以用这个框做任何事情。

你可以插入自定义 JS，完全按自己的想法修改控制台上的元素。你甚至可以插入 Google analytics 标签。

#### CapRover 额外配置：

有些自定义默认不能通过 Ant Design 修改。这些自定义可以通过 CapRover extra configuration 框修改。

目前，这里唯一的参数是控制台侧边栏主题（light 或 dark），但将来可能有更多。

```js
{
  siderTheme: "dark";
}
```



### 提交你的自定义主题！

如果你做了一个有趣的新主题，欢迎提交 pull request，把它加入[我们的内置主题](https://github.com/caprover/caprover/tree/master/template/themes)。
