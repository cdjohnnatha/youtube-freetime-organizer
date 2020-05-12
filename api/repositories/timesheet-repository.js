const { Timesheets, TimesheetScheduleHours, TimesheetVideos, sequelize } = require('../db/models');
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
  const transaction = await sequelize.transaction();
  try {
    const {
      highest_freetime_minutes_of_week,
      timesheet_schedule_hours,
    } = TimesheetScheduleHours.buildByAvailableMinutesArray(available_minutes_per_day);

    let videoService = new VideoService({
      searchKeywords: params.search_keywords,
      highestAvailableMinutesTime: highest_freetime_minutes_of_week,
      availableHoursPerWeek: available_minutes_per_day,
    });
    let searchVideos = videoService.searchVideo();
    let timesheet = Timesheets.findOrCreate({
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
      ],
      transaction,
    });
    ([searchVideos, timesheet] = await Promise.all([searchVideos, timesheet]))
    if (Array.isArray(timesheet)) timesheet = timesheet[0];
    const videoDetails = await searchVideos.buildVideosDetailsFromIds(timesheet.dataValues.id);
    videoDetails.buildTotalDaysNeededToWatchVideoList();

    let savingTimesheetVideos = videoDetails.saveTimesheetVideos(transaction);

    let updateTimesheetPromise = timesheet.update({
      total_days_complete_videos_list: videoDetails.totalDaysNeededToWatchVideoList
    }, { transaction });
    
    await Promise.all([savingTimesheetVideos, updateTimesheetPromise]);
    await transaction.commit();
    return timesheet;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  createTimesheetRepository,
};
