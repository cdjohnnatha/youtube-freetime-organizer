const TimesheetDataTypes = require('./data-types/timesheets/timesheets-data-types');
const ModelSettings = require('../model-settings');

module.exports = (db) => {
  const Timesheet = db.define('Timesheets', TimesheetDataTypes, {
    ...ModelSettings,
    tableName: 'timesheets',
  });

  Timesheet.associate = ({ Timesheets, Users, TimesheetScheduleHours }) => {
    Timesheets.belongsTo(Users, { foreignKey: 'user_id', as: 'timesheets' });
    Timesheets.hasMany(TimesheetScheduleHours, { foreignKey: 'timesheet_id', as: 'timesheet_schedule_hours' });
  };

  return Timesheet;
};