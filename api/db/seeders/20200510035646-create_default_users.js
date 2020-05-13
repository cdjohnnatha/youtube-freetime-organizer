const faker = require('faker');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('auth', [{
      email: 'user@test.com.br',
      password: '123456789',  
    }]);

    const [auth] = await queryInterface.sequelize.query("SELECT id FROM auth WHERE email like 'user@test.com.br'");
    return queryInterface.bulkInsert(
      'users',
      [
        {
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          auth_id: auth[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {}),
};