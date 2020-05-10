const {
  INTEGER,
  STRING,
  DATE,
} = require('sequelize');

module.exports = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  first_name: {
    allowNull: false,
    type: STRING(70),
  },
  last_name: {
    allowNull: false,
    type: STRING(70),
  },
  createdAt: {
    type: DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DATE,
    field: 'updated_at'
  },
  deletedAt: {
    allowNull: true,
    type: DATE,
    field: 'deleted_at',
  },
};
