const { factory } = require('factory-girl');

require('./auth-factory')(factory);
require('./user-factory')(factory);
require('./timesheet/timesheet-factory')(factory);

module.exports = factory;
