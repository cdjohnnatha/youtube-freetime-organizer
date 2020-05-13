const { name, internet, random } = require('faker');
const { Users, Auth } = require('../../api/db/models');


const UserFactory = (factory) => {
  const hooks = {
    afterCreate: async (model, attrs, buildOptions) => {
      if (buildOptions.with_auth) {
        model.dataValues.auth = await Auth.findByPk(model.dataValues.auth_id);
      }
      return model;
    },
  };
  factory.define(
    'Users',
    Users,
      {
        first_name: () => name.firstName(),
        last_name: () => name.lastName(),
        auth_id: factory.assoc('Auth', 'id'),
      },
      hooks,
  );
};

module.exports = UserFactory;