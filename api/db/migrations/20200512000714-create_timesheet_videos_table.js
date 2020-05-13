const TimesheetVideosDataTypes = require('../models/data-types/timesheets/videos/timesheet-videos-data-types');

module.exports = {
  up: (queryInterface) => queryInterface.createTable('timesheet_videos', TimesheetVideosDataTypes),

  down: (queryInterface) => queryInterface.dropTable('timesheet_videos'),
};
