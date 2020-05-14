const {
  TimesheetScheduleHours,
  TimesheetVideos,
  TimesheetVideoThumbnails,
  sequelize,
} = require('../db/models');
const WeekDayHelper = require('../helpers/week-day-helpers');

const getAvailableVideosForTodayRepository = async (timesheet_id) => {
  try {
    const weekDayHelper = new WeekDayHelper();
    const timesheetVideosResult = await TimesheetScheduleHours.findOne({
      where: {
        day_of_week: weekDayHelper.weekDay,
        timesheet_id,
      }
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
    const videosToBeWatchedIds = videosIds.rows.map(({ id }) => id);
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
    return timesheetVideosResult;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAvailableVideosForTodayRepository,
}