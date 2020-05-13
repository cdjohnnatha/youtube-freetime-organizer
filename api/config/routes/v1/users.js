const express = require('express');
const router = express.Router();
const timesheetRoutes = require('./timesheets/timesheet-routes');

router.use('/timesheets', timesheetRoutes);

module.exports = router;
