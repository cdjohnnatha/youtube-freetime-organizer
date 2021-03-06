const {
  Timesheets,
  TimesheetScheduleHours,
  sequelize,
} = require('../db/models');
const VideoService = require('../services/video-services');
const WeekDayHelper = require('../helpers/week-day-helpers');
const { getAvailableVideosForTodayRepository } = require('../repositories/timesheet-scheduled-hours-repository');
const i18n = require('i18n');
const logger = require('../config/logger');
/**
 * 
 * @param {Object} params
 * @param {Array}  available_minutes_per_day - array with 7 numbers regarding days of week.
 * @param {String}  name - name of timesheet.
 * @param {String}  description - Timesheet description.
 * @param {String}  search_keywords - Words to be search on youtube.
 */
const createTimesheetRepository = async ({ available_minutes_per_day, ...params }) => {
  let transaction = null;
  try {
    let timesheet = await Timesheets.findOne({
      where: {
        user_id: params.user_id,
        status: 'IN_PROGRESS',
        search_keywords: params.search_keywords,
      },
    });
    logger.systemLogLevel({
      functionName: 'getAvailableVideosForTodayRepository',
      meta: { timesheet },
    });
    if (timesheet) {
      throw new Error(i18n.__('error.repeated_search_keywords'));
    }
    transaction = await sequelize.transaction();
    const {
      highest_freetime_minutes_of_week,
      timesheet_schedule_hours,
    } = TimesheetScheduleHours.buildByAvailableMinutesArray(available_minutes_per_day);
    logger.systemLogLevel({
      functionName: 'getAvailableVideosForTodayRepository',
      meta: {
        highest_freetime_minutes_of_week,
        timesheet_schedule_hours,
      }
    });
    let videoService = new VideoService({
      searchKeywords: params.search_keywords,
      highestAvailableMinutesTime: highest_freetime_minutes_of_week,
      availableHoursPerWeek: available_minutes_per_day,
    });
    let searchVideos = videoService.searchVideo();
    timesheet = Timesheets.create({
      ...params,
      highest_freetime_minutes_of_week,
      timesheet_schedule_hours,
      transaction,
    }, {
      include: [
        {
          model: TimesheetScheduleHours,
          as: 'timesheet_schedule_hours',
        }
      ],
    });
    logger.systemLogLevel({
      functionName: 'getAvailableVideosForTodayRepository',
      meta: {
        timesheet
      }
    });
    ([searchVideos, timesheet] = await Promise.all([searchVideos, timesheet]))
    if (Array.isArray(timesheet)) timesheet = timesheet[0];
    const videoDetails = await searchVideos.buildVideosDetailsFromIds(timesheet.dataValues.id);
    videoDetails.buildTotalDaysNeededToWatchVideoList();

    await videoDetails.saveTimesheetVideos(transaction);

    const updateTimesheetResult = await timesheet.update({
      total_days_complete_videos_list: videoDetails.totalDaysNeededToWatchVideoList
    }, { transaction });

    await transaction.commit();
    timesheet.dataValues.timesheet_schedule_hours = await getAvailableVideosForTodayRepository(timesheet.dataValues.id);
    transaction = null;
    return timesheet;
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

const getTimesheetFromUserRespository = async (user_id) => {
  try {
    const timesheet = await Timesheets.findOne({
      where: {
        user_id,
        status: 'IN_PROGRESS'
      },
      raw: true,
    });
    return timesheet;
  } catch (error) {
    throw error;
  }
}

const hasTimesheetInProgress = async (user_id) => {
  try {
    const timesheet = await Timesheets.count({
      where: {
        user_id,
        status: 'IN_PROGRESS'
      },
      raw: true,
    });
    return timesheet;
  } catch (error) {
    throw error;
  }
}
const getInProgressTimesheetRepository = async (user_id) => {
  try {
    const timesheet = await Timesheets.findOne({
      attributes: [
        'name',
        'description',
        'search_keywords',
        'status',
        'total_days_complete_videos_list',
        'created_at'
      ],
      where: {
        user_id,
        status: 'IN_PROGRESS'
      },
      include: [
        {
          model: TimesheetScheduleHours,
          as: 'timesheet_schedule_hours',
          attributes: ['day_of_week', 'available_minutes']
        },
      ]
    });
    return timesheet;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTimesheetRepository,
  getTimesheetFromUserRespository,
  getInProgressTimesheetRepository,
  hasTimesheetInProgress
};
