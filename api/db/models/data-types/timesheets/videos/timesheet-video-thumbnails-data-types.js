const {
  INTEGER,
  DATE,
  ENUM,
  STRING,
} = require('sequelize');

module.exports = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  timesheet_video_id: {
    allowNull: false,
    type: INTEGER,
  },
  image_quality_type: {
    type: ENUM,
    values: ['default', 'medium', 'high', 'standard', 'maxres'],
    default: 'default',
    allowNull: false,
  },
  url: {
    type: STRING,
    allowNull: true,
  },
  width: {
    type: INTEGER,
    allowNull: true,
  },
  height: {
    type: INTEGER,
    allowNull: true,
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
