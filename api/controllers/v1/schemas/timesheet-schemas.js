const { object, string, array, number } = require('yup');

const timesheetSchema = object().shape({
  available_minutes_per_day: array(number()).min(7).max(7).required(),
  name: string().required(),
  description: string(),
  search_keywords: string().required(),
});

module.exports = {
  timesheetSchema,
};
