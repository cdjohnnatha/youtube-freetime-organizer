const faker = require('faker');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {}),
};