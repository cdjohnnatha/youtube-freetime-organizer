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
    defaultValue: 'IN_PROGRESS',
    allowNull: true,
  },
  total_days_complete_videos_list: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0,
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
