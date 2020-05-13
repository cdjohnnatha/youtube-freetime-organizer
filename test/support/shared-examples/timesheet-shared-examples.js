const chai = require('chai');

const { expect } = chai;

const shouldBehaveLikeTimesheet = (object) => {
  expect(object).to.have.a.property('id');
  expect(object).to.have.a.property('user_id');
  expect(object).to.have.a.property('name');
  expect(object).to.have.a.property('description');
  expect(object).to.have.a.property('search_keywords');
  expect(object).to.have.a.property('status');
  expect(object).to.have.a.property('total_days_complete_videos_list');
  expect(object).to.have.a.property('createdAt');
  expect(object).to.have.a.property('updatedAt');
  expect(object).to.have.a.property('deletedAt');

  expect(object.id).to.not.be.undefined;
  expect(object.user_id).to.not.be.undefined;
  expect(object.name).to.not.be.undefined;
  expect(object.description).to.not.be.undefined;
  expect(object.search_keywords).to.not.be.undefined;
  expect(object.status).to.not.be.undefined;
  expect(object.total_days_complete_videos_list).to.not.be.undefined;
  expect(object.createdAt).to.not.be.undefined;
  expect(object.updatedAt).to.not.be.undefined;
  expect(object.deletedAt).to.be.null;
};

module.exports = {
  shouldBehaveLikeTimesheet,
};
