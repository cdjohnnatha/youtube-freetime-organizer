const { name, internet, random } = require('faker');
const { Users } = require('../../api/db/models');


const UserFactory = (factory) => {
  factory.define(
    'Users',
    Users,
      {
        first_name: () => name.firstName(),
        last_name: () => name.lastName(),
        auth_id: factory.assoc('Auth', 'id'),
      },
  );
};

module.exports = UserFactory;