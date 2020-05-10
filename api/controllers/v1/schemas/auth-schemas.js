const { object, string } = require('yup');

const signupSchema = object().shape({
  first_name: string().required(),
  last_name: string().required(),
});

module.exports = {
  signupSchema,
};
