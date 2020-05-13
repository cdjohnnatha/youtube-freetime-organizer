const TimesheetScheduleHoursDataTypes = require('./data-types/timesheets/timesheet-schedule-hours-data-types');
const { WEEK_DAYS_ENUM } = require('../../utils/const-utils');
const WeekDayHelpers = require('../../helpers/week-day-helpers')

module.exports = (db) => {
  const TimesheetScheduleHour = db.define('TimesheetScheduleHours', TimesheetScheduleHoursDataTypes, {
    tableName: 'timesheet_schedule_hours',
  });

  TimesheetScheduleHour.buildByAvailableMinutesArray = (available_minutes_per_day) => {
    let highest_freetime_minutes_of_week = 0;
    const weekDayHelper = new WeekDayHelpers();
    let available_minute_today = null;
    const timesheet_schedule_hours = available_minutes_per_day.map((time, index) => {
      
      if (time > highest_freetime_minutes_of_week) {
        highest_freetime_minutes_of_week = time;
      };
      available_minute_today = {
        day_of_week: WEEK_DAYS_ENUM[index],
        available_minutes: time,
      };

      return available_minute_today;
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