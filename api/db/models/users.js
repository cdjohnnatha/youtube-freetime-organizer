const UsersDataTypes = require('./data-types/users-data-types');
const ModelSettings = require('../model-settings');
const { normalize } = require('../../helpers/formatter-helpers');

module.exports = (db) => {
  const User = db.define('Users', UsersDataTypes, {
    ...ModelSettings,
    tableName: 'users',
    hooks: {
      beforeCreate: ({ dataValues }, _options) => {
        dataValues = User.normalizeParams(dataValues);
        return dataValues;
      },
    },
  });
  User.normalizeParams = (params) => {
    const { first_name, last_name } = params;
    params.first_name = normalize(first_name);
    params.last_name = normalize(last_name);

    return params;
  };

  User.associate = ({ Users, Auth }) => {
    Users.belongsTo(Auth, { foreignKey: 'auth_id', as: 'auth_provider' });
  };

  return User;
};