const moment = require('moment');
const i18n = require('i18n');

const { TimesheetVideos, Timesheets, sequelize } = require('../db/models');

const setVideoAsWatchedRepository = async (user_id, timesheetVideoId) => {
  try {
    const timesheetVideoWatched = await TimesheetVideos.findOne({
      where: {
        id: timesheetVideoId,
        watchedAt: null,
      },
      include: [
        {
          model: Timesheets,
          as: 'timesheet',
          attributes: ['id'],
          where: { user_id }
        }
      ],
    });
    if (!timesheetVideoWatched) {
      throw new Error('Timesheet video not found');
    }
    logger.systemLogLevel({
      functionName: 'setVideoAsWatchedRepository',
      meta: {
        timesheetVideoWatched: timesheetVideoWatched.dataValues,
      },
    });
    const updateResult = await timesheetVideoWatched.update({
      watchedAt: moment(),
    });

    logger.systemLogLevel({
      functionName: 'setVideoAsWatchedRepository',
      meta: {
        updateResult: updateResult,
      },
    });

    const isInProgressYet = await TimesheetVideos.count({
      where: {
        id: timesheetVideoId,
        watchedAt: null,
      },
      include: [
        {
          model: Timesheets,
          as: 'timesheet',
          attributes: ['id'],
          where: { user_id }
        }
      ],
    });
    logger.systemLogLevel({
      functionName: 'setVideoAsWatchedRepository',
      meta: {
        isInProgressYet: isInProgressYet.dataValues,
      },
    });

    if (!isInProgressYet) {
      const completeStateTimesheert = await Timesheets.update({ status: 'COMPLETED' }, { where: { user_id } });
      logger.systemLogLevel({
        functionName: 'setVideoAsWatchedRepository',
        meta: {
          completeStateTimesheert,
        },
      });
    }

    return updateResult;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  setVideoAsWatchedRepository,
};
