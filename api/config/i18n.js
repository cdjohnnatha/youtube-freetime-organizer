const i18n = require('i18n');

i18n.configure({
  locales: ['en'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  register: global,
  objectNotation: true,
  updateFiles: false,
});

module.exports = i18n;