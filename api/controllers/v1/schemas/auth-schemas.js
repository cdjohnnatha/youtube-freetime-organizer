const { object, string } = require('yup');

const authEmailSchema = object().shape({
  email: string().required().email(),
  password: string().required(),
});

const signupSchema = object().shape({
  first_name: string().required(),
  last_name: string().required(),
  auth_provider: object().shape({
    email: string().required().email(),
    password: string().required().min(8),
  }),
});

module.exports = {
  signupSchema,
  authEmailSchema,
};
