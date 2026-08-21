module.exports = require("../content/locales.json").map((locale) => ({
  enabled: locale.enabled,
  name: locale.label,
  tag: locale.code,
}));
