const bcrypt = require('bcrypt');

const AuthDataTypes = require('./data-types/auth-data-types');

module.exports = (db) => {
  const Auth = db.define('Auth', AuthDataTypes, {
    tableName: 'auth',
    hooks: {
      beforeCreate: ({ dataValues }, _options) => {
        dataValues.password = bcrypt.hashSync(dataValues.password, bcrypt.genSaltSync(10));
        return dataValues;
      },
      afterCreate: ({ dataValues }, _options) => {
        delete dataValues.password;

        return dataValues;
      }
    },
  });

  Auth.isPasswordValid = async ({ email, password }) => {
    const auth = await Auth.findOne({
      where: { email },
      attributes: ['password'],
      raw: true,
    });
    if (auth) {
      return bcrypt.compare(password, auth.password);
    }
    return false;
  };

  Auth.associate = ({ Auth: auth, Users }) => {
    auth.hasOne(Users, { foreignKey: 'auth_id', as: 'users' });
  };

  return Auth;
};