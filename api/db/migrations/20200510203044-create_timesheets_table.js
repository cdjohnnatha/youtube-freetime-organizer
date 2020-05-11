const TimesheetDataTypes = require('../models/data-types/timesheets/timesheets-data-types');

module.exports = {
  up: (queryInterface) => queryInterface.createTable('timesheets', TimesheetDataTypes),

  down: (queryInterface) => queryInterface.dropTable('timesheets'),
};
