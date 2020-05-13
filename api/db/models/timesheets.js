const TimesheetDataTypes = require('./data-types/timesheets/timesheets-data-types');

module.exports = (db) => {
  const Timesheet = db.define('Timesheets', TimesheetDataTypes, {
    tableName: 'timesheets',
  });

  Timesheet.associate = ({ Timesheets, Users, TimesheetScheduleHours, TimesheetVideos }) => {
    Timesheets.belongsTo(Users, { foreignKey: 'user_id', as: 'timesheets' });
    Timesheets.hasMany(TimesheetScheduleHours, { foreignKey: 'timesheet_id', as: 'timesheet_schedule_hours' });
    Timesheets.hasMany(TimesheetVideos, { foreignKey: 'timesheet_id', as: 'timesheet_videos' });
  };

  return Timesheet;
};