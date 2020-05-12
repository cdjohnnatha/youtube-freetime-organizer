const {
  INTEGER,
  STRING,
  DATE,
  TEXT,
  FLOAT,
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
  title: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: TEXT,
    allowNull: true,
  },
  duration: {
    type: FLOAT,
    allowNull: false,
  },
  youtube_video_id_key: {
    type: STRING,
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
  watchedAt: {
    type: DATE,
    field: 'watched_at'
  },
  deletedAt: {
    allowNull: true,
    type: DATE,
    field: 'deleted_at',
  },
};
