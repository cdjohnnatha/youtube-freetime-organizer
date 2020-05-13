const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const usersRoutes = require('./users');
const authMiddleware = require('../../../config/middlewares/auth-middleware');

/* GET users listing. */
router.use('/', authRoutes);
router.use('/users', [authMiddleware], usersRoutes);

module.exports = router;
