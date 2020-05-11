const { object, string, array, number } = require('yup');

const timesheetSchema = object().shape({
  available_minutes_per_day: array(number()).required().min(7).max(7),
  name: string().required(),
  description: string(),
  search_keywords: string().required(),
});

module.exports = {
  timesheetSchema,
};
