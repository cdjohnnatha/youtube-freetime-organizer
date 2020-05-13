const express = require('express');
const router = express.Router();
const { createTimesheetController } = require('../../../../controllers/v1/timesheet-controller');

router.post('/', createTimesheetController);

module.exports = router;
