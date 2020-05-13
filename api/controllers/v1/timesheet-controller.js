const { houstonClientErrors } = require('houston-errors');
const { createTimesheetRepository } = require('../../repositories/timesheet-repository');
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

module.exports = {
  createTimesheetController,
};
