require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'dev';

const dialectHost = {
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'postgres',
}

const config = {
  timestamps: true,
  underscored: true,
  paranoid: true,
  logging: process.env.LOGGER_DATABASE_SQL == 'true' ? console.log : false,
};

const connectionSetup = {
  production: {
    username: process.env.DB_USER || 'freetime_user',
    password: process.env.DB_PASS || 'fr33t1m3',
    database: process.env.DB_NAME || 'youtube_freetime_organizer',
    ...dialectHost,
    ...config,
  },
  dev: {
    username: process.env.DB_USER || 'freetime_user',
    password: process.env.DB_PASS || 'fr33t1m3',
    database: process.env.DB_NAME || 'youtube_freetime_organizer',
    ...dialectHost,
    ...config,
  },
  test: {
    username: process.env.DB_USER || 'freetime_user_test',
    password: process.env.DB_PASS || 'fr33t1m3T3st',
    database: process.env.DB_NAME || 'youtube_freetime_organizer_test',
    ...dialectHost,
    ...config,
  },
}[NODE_ENV];


module.exports = connectionSetup;