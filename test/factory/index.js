const { factory } = require('factory-girl');

require('./auth-factory')(factory);
require('./user-factory')(factory);

module.exports = factory;
