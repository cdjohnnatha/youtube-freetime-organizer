const chai = require('chai');

const { expect } = chai;

const shouldBehaveLikeTimesheetScheduledhours = (object) => {
  expect(object).to.have.a.property('id');
  expect(object).to.have.a.property('timesheet_id');
  expect(object).to.have.a.property('day_of_week');
  expect(object).to.have.a.property('available_minutes');
  expect(object).to.have.a.property('createdAt');
  expect(object).to.have.a.property('updatedAt');
  expect(object).to.have.a.property('deletedAt');
  
  expect(object.id).to.not.be.undefined;
  expect(object.timesheet_id).to.not.be.undefined;
  expect(object.day_of_week).to.not.be.undefined;
  expect(object.available_minutes).to.not.be.undefined;
  expect(object.createdAt).to.not.be.undefined;
  expect(object.updatedAt).to.not.be.undefined;
  expect(object.deletedAt).to.be.null;
};

module.exports = {
  shouldBehaveLikeTimesheetScheduledhours,
}
