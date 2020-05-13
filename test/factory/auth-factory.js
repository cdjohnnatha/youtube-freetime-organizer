const { internet } = require('faker');
const { Auth } = require('../../api/db/models');

const AuthFactory = (factory) => {
  factory.define(
    'Auth',
    Auth,
    {
      email: () => internet.email(),
      password: '123456789',
    },
  );
};

module.exports = AuthFactory;