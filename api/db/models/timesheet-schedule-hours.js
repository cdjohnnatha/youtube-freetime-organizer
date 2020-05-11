const TimesheetScheduleHoursDataTypes = require('./data-types/timesheets/timesheet-schedule-hours-data-types');
const ModelSettings = require('../model-settings');
const { WEEK_DAYS_ENUM } = require('../../utils/const-utils');

module.exports = (db) => {
  const TimesheetScheduleHour = db.define('TimesheetScheduleHours', TimesheetScheduleHoursDataTypes, {
    ...ModelSettings,
    tableName: 'timesheet_schedule_hours',
  });

  TimesheetScheduleHour.buildByAvailableMinutesArray = (available_minutes_per_day) => {
    let highest_freetime_minutes_of_week = 0;
    const timesheet_schedule_hours = available_minutes_per_day.map((time, dayOfWeek) => {
      if (time > highest_freetime_minutes_of_week) {
        highest_freetime_minutes_of_week = time;
      };

      return {
        day_of_week: WEEK_DAYS_ENUM[dayOfWeek],
        available_minutes: time,
      };
    });
    return {
      highest_freetime_minutes_of_week,
      timesheet_schedule_hours,
    }
  }

  TimesheetScheduleHour.associate = ({ Timesheets, TimesheetScheduleHours }) => {
    TimesheetScheduleHours.belongsTo(Timesheets, { foreignKey: 'timesheet_id', as: 'timesheet' });
  };

  return TimesheetScheduleHour;
};