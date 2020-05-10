const UsersDataTypes = require('./data-types/users-data-types');
const ModelSettings = require('../model-settings');
const { normalize } = require('../../helpers/formatter-helpers');

module.exports = (db) => {
  const Users = db.define('Users', UsersDataTypes, {
    ...ModelSettings,
    tableName: 'users',
    hooks: {
      beforeCreate: ({ dataValues }, _options) => {
        dataValues = Users.normalizeParams(dataValues);
        return dataValues;
      },
    },
  });
  Users.normalizeParams = (params) => {
    const { first_name, last_name } = params;
    params.first_name = normalize(first_name);
    params.last_name = normalize(last_name);

    return params;
  };

  Users.associate = () => {};

  return Users;
};