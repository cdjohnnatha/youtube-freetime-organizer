const chai = require('chai');

const { expect } = chai;

const shouldBehaveLikeUser = ({ user }) => {
  expect(user).to.have.a.property('id');
  expect(user).to.have.a.property('first_name');
  expect(user).to.have.a.property('last_name');
  
  expect(user.id).to.not.be.undefined;
  expect(user.first_name).to.not.be.undefined;
  expect(user.last_name).to.not.be.undefined;
};

module.exports = {
  shouldBehaveLikeUser,
}