const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const routes = require('./api/config/routes');
const i18n = require('./api/config/i18n');
const errorMiddleware = require('./api/config/middlewares/error-middleware');

const app = express();


app.use(i18n.init);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(errorMiddleware);

app.use('/api', routes);

module.exports = app;
