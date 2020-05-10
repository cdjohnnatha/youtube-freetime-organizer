'use strict';

module.exports = {
  up: (queryInterface, { STRING }) =>  queryInterface.addColumn(
    'users',
    'auth_id',
    STRING
  ),

  down: (queryInterface, _Sequelize) => queryInterface.removeColumn(
    'users',
    'auth_id',
  ),
};
