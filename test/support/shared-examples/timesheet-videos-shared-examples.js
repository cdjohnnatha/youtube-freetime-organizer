const chai = require('chai');

const { expect } = chai;

const shouldBehaveLikeTimesheetVideos = (object) => {
  expect(object).to.have.a.property('id');
  expect(object).to.have.a.property('timesheet_id');
  expect(object).to.have.a.property('title');
  expect(object).to.have.a.property('description');
  expect(object).to.have.a.property('duration');
  expect(object).to.have.a.property('youtube_video_id_key');
  expect(object).to.have.a.property('createdAt');
  expect(object).to.have.a.property('updatedAt');
  expect(object).to.have.a.property('watchedAt');
  expect(object).to.have.a.property('deletedAt');
  expect(object).to.have.a.property('timesheet_video_thumbnails');
  
  expect(object.id).to.not.be.undefined;
  expect(object.timesheet_id).to.not.be.undefined;
  expect(object.title).to.not.be.undefined;
  expect(object.description).to.not.be.undefined;
  expect(object.duration).to.not.be.undefined;
  expect(object.youtube_video_id_key).to.not.be.undefined;
  expect(object.createdAt).to.not.be.undefined;
  expect(object.updatedAt).to.not.be.undefined;
  expect(object.watchedAt).to.not.be.undefined;
  expect(object.deletedAt).to.be.null;
  expect(object.timesheet_video_thumbnails).to.not.be.undefined;
};

const shouldBehaveLikeTimesheetVideosList = (timesheetVideosList) => {
  expect(timesheetVideosList).to.be.an('Array');
  timesheetVideosList.forEach((timesheetVideo) => shouldBehaveLikeTimesheetVideos(timesheetVideo));
}

module.exports = {
  shouldBehaveLikeTimesheetVideos,
  shouldBehaveLikeTimesheetVideosList,
};
