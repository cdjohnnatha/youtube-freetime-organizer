const TimesheetScheduleHoursDataTypes = require('../models/data-types/timesheets/timesheet-schedule-hours-data-types');

module.exports = {
  up: (queryInterface) => queryInterface.createTable('timesheet_schedule_hours', TimesheetScheduleHoursDataTypes),

  down: (queryInterface) => queryInterface.dropTable('timesheet_schedule_hours'),
};
