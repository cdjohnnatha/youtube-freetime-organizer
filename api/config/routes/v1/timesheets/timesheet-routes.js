const express = require('express');
const router = express.Router();
const { createTimesheetController, availableVideosController } = require('../../../../controllers/v1/timesheet-controller');

router.post('/', createTimesheetController);
router.get('/available-videos', availableVideosController);

module.exports = router;
