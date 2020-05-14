const {
  TimesheetScheduleHours,
  TimesheetVideos,
  TimesheetVideoThumbnails,
  sequelize,
} = require('../db/models');
const WeekDayHelper = require('../helpers/week-day-helpers');
const logger = require('../config/logger');

const getAvailableVideosForTodayRepository = async (timesheet_id) => {
  try {
    const weekDayHelper = new WeekDayHelper();
    const timesheetVideosResult = await TimesheetScheduleHours.findOne({
      where: {
        day_of_week: weekDayHelper.weekDay,
        timesheet_id,
      }
    });
    logger.systemLogLevel({
      functionName: 'getAvailableVideosForTodayRepository',
      meta: {
        timesheetVideosResult,
      },
    });

    const CUMULATIVE_DURATION_QUERY = `
      SELECT id
      FROM(
        SELECT id, watched_at, cumulativeDuration
              FROM(
          SELECT id,
          timesheet_id,
          watched_at,
          created_at,
          sum(duration) OVER(order by id, created_at) as cumulativeDuration
                        FROM timesheet_videos
                        WHERE timesheet_id = ${timesheet_id}
        ) AS cumulative
              WHERE watched_at IS NULL
                and cumulative.cumulativeDuration <= ${timesheetVideosResult.dataValues.available_minutes}
      ) as videosAvailable
    `;

    const [, videosIds] = await sequelize.query(CUMULATIVE_DURATION_QUERY);
    logger.systemLogLevel({
      functionName: 'getAvailableVideosForTodayRepository',
      meta: {
        videosIds,
      },
    });
    const videosToBeWatchedIds = videosIds.rows.map(({ id }) => id);
    logger.systemLogLevel({
      functionName: 'getAvailableVideosForTodayRepository',
      meta: {
        videosToBeWatchedIds,
      },
    });
    timesheetVideosResult.dataValues.timesheet_videos = await TimesheetVideos.findAll({
      where: {
        id: videosToBeWatchedIds,
      },
      include: [
        {
          model: TimesheetVideoThumbnails,
          as: 'timesheet_video_thumbnails'
        }
      ]
    });
    logger.systemLogLevel({
      functionName: 'getAvailableVideosForTodayRepository',
      meta: {
        timesheetVideosResult: timesheetVideosResult.dataValues,
      },
    });
    return timesheetVideosResult;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAvailableVideosForTodayRepository,
}