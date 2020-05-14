const { houstonClientErrors } = require('houston-errors');
const i18n = require('i18n');
const {
  createTimesheetRepository,
  getTimesheetFromUserRespository,
  hasTimesheetInProgress,
  getInProgressTimesheetRepository,
} = require('../../repositories/timesheet-repository');
const { getAvailableVideosForTodayRepository } = require('../../repositories/timesheet-scheduled-hours-repository');
const { timesheetSchema } = require('./schemas/timesheet-schemas');
const logger = require('../../config/logger');
const { formatErrorMessage } = require('../../helpers/formatter-helpers');

const { BAD_REQUEST } = houstonClientErrors;


const createTimesheetController = async ({ body, meta }, res) => {
  try {
    await timesheetSchema.validate(body);
    body.user_id = meta.user_id;
    const timesheet = await createTimesheetRepository(body);
    res.status(201).send(timesheet);
  } catch (error) {
    logger.systemLogLevel({ error, level: 'error' });
    res.status(BAD_REQUEST.code).send(formatErrorMessage(error));
  };
};

const availableVideosController = async ({ body, meta }, res) => {
  try {
    const timesheet = await getTimesheetFromUserRespository(meta.user_id);
    if (!timesheet) {
      res.status(200).send(i18n.__('empty_in_progress_timesheet'));
    } else {
      const availableVideos = await getAvailableVideosForTodayRepository(timesheet.id);
      res.status(200).send(availableVideos);
    }
  } catch (error) {
    logger.systemLogLevel({ error, level: 'error' });
    res.status(BAD_REQUEST.code).send(formatErrorMessage(error));
  };
};

const setVideoAsWatchedController = async ({ params, meta }, res) => {
  try {
    const { id } = params;
    const watchedVideo = await setVideoAsWatchedRepository(meta.user_id, id);
    res.status(200).send(watchedVideo);
  } catch (error) {
    logger.systemLogLevel({ error, level: 'error' });
    res.status(BAD_REQUEST.code).send(formatErrorMessage(error));
  };
};

const timesheetInProgressController = async ({ meta }, res) => {
  try {
    const inProgressTimesheet = await getInProgressTimesheetRepository(meta.user_id);
    res.status(200).send(inProgressTimesheet);
  } catch (error) {
    logger.systemLogLevel({ error, level: 'error' });
    res.status(BAD_REQUEST.code).send(formatErrorMessage(error));
  };
};

module.exports = {
  createTimesheetController,
  availableVideosController,
  setVideoAsWatchedController,
  timesheetInProgressController,
};
