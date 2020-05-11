const { Timesheets, TimesheetScheduleHours } = require('../db/models');

const createTimesheetRepository = async ({ available_minutes_per_day, ...params }) => {
  try {
    const {
      highest_freetime_minutes_of_week,
      timesheet_schedule_hours,
    } = TimesheetScheduleHours.buildByAvailableMinutesArray(available_minutes_per_day);
    console.log('\n\n[highest_freetime_minutes_of_week]');
    console.log('[highest_freetime_minutes_of_week]', timesheet_schedule_hours);
    console.log('\n\n[highest_freetime_minutes_of_week]');
    const timesheet = await Timesheets.findOrCreate({
      where: {
        user_id: params.user_id,
        status: 'IN_PROGRESS',
      },
      defaults: {
        ...params,
        highest_freetime_minutes_of_week,
        timesheet_schedule_hours,
      },
      include: [
        {
          model: TimesheetScheduleHours,
          as: 'timesheet_schedule_hours',
        }
      ]
    });

    return timesheet;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTimesheetRepository,
};
