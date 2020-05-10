require('dotenv').config();

module.exports = {
  username: process.env.DB_USER || 'freetime_user',
  password: process.env.DB_PASS || 'fr33t1m3',
  database: process.env.DB_NAME || 'youtube_freetime_organizer',
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'postgres',
};