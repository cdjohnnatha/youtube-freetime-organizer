const TimesheetVideoThumbnailssDataTypes = require('../models/data-types/timesheets/videos/timesheet-video-thumbnails-data-types');

module.exports = {
  up: (queryInterface) => queryInterface.createTable('timesheet_video_thumbnails', TimesheetVideoThumbnailssDataTypes),

  down: (queryInterface) => queryInterface.dropTable('timesheet_video_thumbnails'),
};
