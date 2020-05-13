const TimesheetVideoThumbnailsDataTypes = require('./data-types/timesheets/videos/timesheet-video-thumbnails-data-types');

module.exports = (db) => {
  const TimesheetVideoThumbnail = db.define('TimesheetVideoThumbnails', TimesheetVideoThumbnailsDataTypes, {
    tableName: 'timesheet_video_thumbnails',
  });

  TimesheetVideoThumbnail.associate = ({ TimesheetVideos, TimesheetVideoThumbnails }) => {
    TimesheetVideoThumbnails.belongsTo(TimesheetVideos, { foreignKey: 'timesheet_video_id', as: 'timesheet_video' });
  };

  return TimesheetVideoThumbnail;
};