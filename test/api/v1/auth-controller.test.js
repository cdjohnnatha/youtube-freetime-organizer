const chai = require('chai');
const chaiHttp = require('chai-http');
const { houstonClientErrors } = require('houston-errors');

const app = require('../../../app');
const { baseApiV1Routes } = require('../../support/helpers/request-helpers');
const Factory = require('../../factory');
const { shouldBehaveLikeUser } = require('../../support/shared-examples/users-shared-examples');

chai.use(chaiHttp);
const { expect } = chai;
const { BAD_REQUEST } = houstonClientErrors;

const usersBaseRoute = `${baseApiV1Routes}sign-up/`;

let userParams = null;
let authParams = null;
let user = null;
describe('Users-controller', () => {
  after(async () => {
    await Factory.cleanUp('Users');
  });
  describe('Register user', () => {
    beforeEach(async () => {
      let users = Factory.build('Users');
      let auth = Factory.build('Auth');

      ([users, auth] = await Promise.all([users, auth]));
      userParams = users.dataValues;
      userParams.auth_provider = auth.dataValues;
      delete userParams.auth_id;
      delete userParams.id;
      delete userParams.auth_provider.id;
    });

    describe('with success params', () => {
      it(`create user with right params should return a created user`, async () => {
        const response = await chai.request(app).post(usersBaseRoute).send(userParams);
        expect(response.statusCode).to.equal(201);
        const { body } = response;
        shouldBehaveLikeUser(body);
      });
      it(`create user with special characters, should create but without them`, async () => {
        const firstName = userParams.first_name;
        const lastName = userParams.first_name;
        userParams.first_name = `!@#$%^&*()${firstName}`;
        userParams.last_name = `!@#$%^&*()${lastName}`;
        const response = await chai.request(app).post(usersBaseRoute).send(userParams);
        expect(response.statusCode).to.equal(201);
        const { body } = response;
        expect(body.first_name).to.be.eq(firstName);
        expect(body.last_name).to.be.eq(lastName);
      });
    });
    // describe('Unauthorized reseller', () => {
    //   it('get accumulated cashback without token should return 401', async () => {
    //     const response = await chai.request(app).get(`${resellerBaseRoute}profile`);
    //     expect(response.statusCode).to.eq(401);
    //   });
    // });
    // });
  });
});