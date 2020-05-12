const {
  INTEGER,
  STRING,
  DATE,
  TEXT,
  ENUM,
} = require('sequelize');

module.exports = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  user_id: {
    allowNull: false,
    type: INTEGER,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: TEXT,
    allowNull: true,
  },
  search_keywords: {
    type: STRING,
    allowNull: false,
  },
  status: {
    type: ENUM,
    values: ['IN_PROGRESS', 'COMPLETED'],
    default: 'IN_PROGRESS',
    allowNull: false,
  },
  total_days_to_complete_timesheet: {
    type: INTEGER,
    allowNull: true,
    default: 0,
  },
  highest_freetime_minutes_of_week: {
    type: INTEGER,
    allowNull: false,
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