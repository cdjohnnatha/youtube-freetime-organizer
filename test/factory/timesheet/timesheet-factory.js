const { commerce } = require('faker');
const { Timesheets } = require('../../../api/db/models');

const UserFactory = (factory) => {
  factory.define(
    'Timesheets',
    Timesheets,
      {
        name: () => commerce.productName(),
        description: () => commerce.productAdjective(),
        search_keywords: () => commerce.productName(),
      },
  );
};

module.exports = UserFactory;