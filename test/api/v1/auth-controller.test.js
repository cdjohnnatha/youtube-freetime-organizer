const chai = require('chai');
const chaiHttp = require('chai-http');
const { houstonClientErrors } = require('houston-errors');

const app = require('../../../app');
const { baseApiV1Routes } = require('../../support/helpers/request-helpers');
const Factory = require('../../factory');
const { shouldBehaveLikeUser } = require('../../support/shared-examples/users-shared-examples');
const i18n = require('../../../api/config/i18n');

chai.use(chaiHttp);
const { expect } = chai;
const { BAD_REQUEST } = houstonClientErrors;

const signUpBaseRoute = `${baseApiV1Routes}sign-up/`;
const signInBaseRoute = `${baseApiV1Routes}sign-in/`;

let userParams = null;
let authParams = null;
let user = null;
let auth_provider = null;


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

    describe('with right params', () => {
      it(`create user with right params should return a created user`, async () => {
        const response = await chai.request(app).post(signUpBaseRoute).send(userParams);
        expect(response.statusCode).to.equal(201);
        shouldBehaveLikeUser(response.body);
      });
      it(`create user with special characters, should create but without them`, async () => {
        const firstName = userParams.first_name;
        const lastName = userParams.first_name;
        userParams.first_name = `!@#$%^&*()${firstName}`;
        userParams.last_name = `!@#$%^&*()${lastName}`;
        const response = await chai.request(app).post(signUpBaseRoute).send(userParams);
        expect(response.statusCode).to.equal(201);
        expect(response.body.first_name).to.be.eq(firstName);
        expect(response.body.last_name).to.be.eq(lastName);
      });
    });
    describe('with wrong params', () => {
      it(`create user without first_name, should return an error`, async () => {
        const params = { ...userParams };
        delete params.first_name;
        const response = await chai.request(app).post(signUpBaseRoute).send(params);
        expect(response.statusCode).to.equal(400);
      });
      it(`create user without last_name, should return an error`, async () => {
        const params = { ...userParams };
        delete params.last_name;
        const response = await chai.request(app).post(signUpBaseRoute).send(params);
        expect(response.statusCode).to.equal(400);
      });
      it(`create user without auth_provider, should return an error`, async () => {
        const params = { ...userParams };
        delete params.auth_provider;
        const response = await chai.request(app).post(signUpBaseRoute).send(params);
        expect(response.statusCode).to.equal(400);
      });
      it(`create user without auth_provider object but seting email/password directly on root object, should return an error`, async () => {
        const params = { ...userParams };
        params.email = params.auth_provider.email;
        params.password = params.auth_provider.password;
        delete params.auth_provider;
        const response = await chai.request(app).post(signUpBaseRoute).send(params);
        expect(response.statusCode).to.equal(400);
      });
      it(`create user without auth_provider.email, should return an error`, async () => {
        const params = { ...userParams };
        delete params.auth_provider.email;
        const response = await chai.request(app).post(signUpBaseRoute).send(params);
        expect(response.statusCode).to.equal(400);
      });
      it(`create user without auth_provider.password, should return an error`, async () => {
        const params = { ...userParams };
        delete params.auth_provider.password;
        const response = await chai.request(app).post(signUpBaseRoute).send(params);
        expect(response.statusCode).to.equal(400);
      });
      it(`create user.auth_provider.password with less than 8 digits, should return an error`, async () => {
        const params = { ...userParams };
        params.auth_provider.password = '123';
        const response = await chai.request(app).post(signUpBaseRoute).send(params);
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  describe('SignIn user', () => {
    before(async () => {
      user = await Factory.create('Users', {}, { with_auth: true });
      auth_provider = {
        email: user.dataValues.auth.email,
        password: '123456789',
      }
    });

    describe('with right params', () => {
      it('Should return authentication key', async () => {
        const response = await chai.request(app).post(signInBaseRoute).send(auth_provider);
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.a.property('jwt');
        expect(response.body.jwt).to.not.be.undefined;
      });
    });
    describe('with wrong params', () => {
      it('Sending wrong password, should get Invalid email or password message', async () => {
        let auth = { ...auth_provider };
        auth.password = '123';
        const response = await chai.request(app).post(signInBaseRoute).send(auth);
        expect(response.statusCode).to.equal(400);
        expect(response.text).to.equal(i18n.__('error.invalid_sign_in'));
      });
      it('Sending wrong password, should return an error', async () => {
        let auth = { ...auth_provider };
        auth.password = '123';
        const response = await chai.request(app).post(signInBaseRoute).send(auth);
        expect(response.statusCode).to.equal(400);
        expect(response.text).to.equal(i18n.__('error.invalid_sign_in'));
      });
      it('Sending without key email, should return an error', async () => {
        let auth = { ...auth_provider };
        delete auth.email;
        const response = await chai.request(app).post(signInBaseRoute).send(auth);
        expect(response.statusCode).to.equal(400);
        expect(response.text).to.equal('email is a required field');
      });
      it('Sending without key password, should return an error', async () => {
        let auth = { ...auth_provider };
        delete auth.password;
        const response = await chai.request(app).post(signInBaseRoute).send(auth);
        expect(response.statusCode).to.equal(400);
        expect(response.text).to.equal('password is a required field');
      });
    });
  });
});