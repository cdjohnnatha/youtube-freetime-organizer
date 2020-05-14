const express = require('express');
const router = express.Router();
const {
  createTimesheetController,
  availableVideosController,
  setVideoAsWatchedController,
} = require('../../../../controllers/v1/timesheet-controller');

router.post('/', createTimesheetController);
router.get('/available-videos', availableVideosController);
router.get('/videos/:id', setVideoAsWatchedController);

module.exports = router;
