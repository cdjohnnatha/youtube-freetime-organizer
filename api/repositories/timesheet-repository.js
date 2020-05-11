const { Timesheets, TimesheetScheduleHours } = require('../db/models');
const VideoService = require('../services/video-services');

/**
 * 
 * @param {Object} params
 * @param {Array}  available_minutes_per_day - array with 7 numbers regarding days of week.
 * @param {String}  name - name of timesheet.
 * @param {String}  description - Timesheet description.
 * @param {String}  search_keywords - Words to be search on youtube.
 */
const createTimesheetRepository = async ({ available_minutes_per_day, ...params }) => {
  try {
    let videoService = new VideoService();
    await (await videoService.searchVideo(params.search_keywords)).buildVideosDetailsFromIds();
    // const {
    //   highest_freetime_minutes_of_week,
    //   timesheet_schedule_hours,
    // } = TimesheetScheduleHours.buildByAvailableMinutesArray(available_minutes_per_day);
    // const timesheet = await Timesheets.findOrCreate({
    //   where: {
    //     user_id: params.user_id,
    //     status: 'IN_PROGRESS',
    //   },
    //   defaults: {
    //     ...params,
    //     highest_freetime_minutes_of_week,
    //     timesheet_schedule_hours,
    //   },
    //   include: [
    //     {
    //       model: TimesheetScheduleHours,
    //       as: 'timesheet_schedule_hours',
    //     }
    //   ]
    // });

    return timesheet;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTimesheetRepository,
};
