const TimesheetVideosDataTypes = require('./data-types/timesheets/videos/timesheet-videos-data-types');

module.exports = (db) => {
  const TimesheetVideo = db.define('TimesheetVideos', TimesheetVideosDataTypes, {
    tableName: 'timesheet_videos',
  });

  TimesheetVideo.associate = ({ Timesheets, TimesheetVideos, TimesheetVideoThumbnails }) => {
    TimesheetVideos.belongsTo(Timesheets, { foreignKey: 'timesheet_id', as: 'timesheet' });
    TimesheetVideos.hasMany(TimesheetVideoThumbnails, { foreignKey: 'timesheet_video_id', as: 'timesheet_video_thumbnails' });
  };

  return TimesheetVideo;
};