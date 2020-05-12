const TimesheetVideoThumbnailsDataTypes = require('./data-types/timesheets/videos/timesheet-video-thumbnails-data-types');
const ModelSettings = require('../model-settings');

module.exports = (db) => {
  const TimesheetVideoThumbnail = db.define('TimesheetVideoThumbnails', TimesheetVideoThumbnailsDataTypes, {
    ...ModelSettings,
    tableName: 'timesheet_video_thumbnails',
  });

  TimesheetVideoThumbnail.associate = ({ TimesheetVideos, TimesheetVideoThumbnails }) => {
    TimesheetVideoThumbnails.belongsTo(TimesheetVideos, { foreignKey: 'timesheet_video_id', as: 'timesheet_video' });
  };

  return TimesheetVideoThumbnail;
};