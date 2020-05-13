const {
  INTEGER,
  DATE,
  ENUM,
} = require('sequelize');

module.exports = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  timesheet_id: {
    allowNull: false,
    type: INTEGER,
  },
  day_of_week: {
    type: ENUM,
    values: [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY'
    ],
    allowNull: false,
  },
  available_minutes: {
    type: INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DATE,
    field: 'updated_at',
  },
  deletedAt: {
    allowNull: true,
    type: DATE,
    field: 'deleted_at',
  },
};
