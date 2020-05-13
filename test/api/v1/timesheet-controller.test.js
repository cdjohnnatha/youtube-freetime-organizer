const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../../app');
const { baseApiV1Routes, getBearerTokenFromAuthentication } = require('../../support/helpers/request-helpers');
const Factory = require('../../factory');
const { shouldBehaveLikeTimesheet } = require('../../support/shared-examples/timesheet-shared-examples')
const { shouldBehaveLikeTimesheetScheduledhours } = require('../../support/shared-examples/timesheet-scheduled-hours-shared-examples')
const { shouldBehaveLikeTimesheetVideosList } = require('../../support/shared-examples/timesheet-videos-shared-examples')

chai.use(chaiHttp);
const { expect } = chai;

const timesheetsBaseRoute = `${baseApiV1Routes}users/timesheets`;

let authToken = null;
let timesheetParams = null;
const AVAILABLE_MINUTES_PER_DAY_MOCK = [15, 120, 30, 150, 20, 40, 90];
const WeekDayHelpers = require('../../../api/helpers/week-day-helpers');

describe('Users-controller', () => {
  after(async () => {
    await Factory.cleanUp('Users');
    await Factory.cleanUp('Auth');
  });
  before(async () => {
    const user = await Factory.create('Users', {}, { with_auth: true });
    authToken = await getBearerTokenFromAuthentication({
      email: user.dataValues.auth.email,
      app,
      chai,
    });
  });
  describe('Create timesheet', () => {
    beforeEach(async () => {
      ({ dataValues: timesheetParams } = await Factory.build('Timesheets'));
      timesheetParams.available_minutes_per_day = AVAILABLE_MINUTES_PER_DAY_MOCK;
    })
    describe('Authenticated user', () => {
      describe('with right params', () => {
        it('It should create a timesheet with scheduled hours and videos to be watched', async () => {
          const response = await chai
            .request(app)
            .post(timesheetsBaseRoute)
            .set('Authorization', authToken)
            .send(timesheetParams);
          expect(response.statusCode).to.equal(201);
          shouldBehaveLikeTimesheet(response.body);
          shouldBehaveLikeTimesheetScheduledhours(response.body.timesheet_schedule_hours);
          shouldBehaveLikeTimesheetVideosList(response.body.timesheet_schedule_hours.timesheet_videos);
        });
        it('Without description it should create', async () => {
          const params = { ...timesheetParams };
          delete params.description;
          const response = await chai
            .request(app)
            .post(timesheetsBaseRoute)
            .set('Authorization', authToken)
            .send(params);
          expect(response.statusCode).to.equal(201);
          shouldBehaveLikeTimesheet(response.body);
          shouldBehaveLikeTimesheetScheduledhours(response.body.timesheet_schedule_hours);
          shouldBehaveLikeTimesheetVideosList(response.body.timesheet_schedule_hours.timesheet_videos);
        });
      });
      describe('With wrong params', () => {
        it('Without token should return unauthorized', async () => {
          const response = await chai
            .request(app)
            .post(timesheetsBaseRoute)
            .send(timesheetParams);
          expect(response.statusCode).to.equal(401);
        });
        it('Without available_minutes_per_day should return error', async () => {
          const params = { ...timesheetParams };
          delete params.available_minutes_per_day;
          const response = await chai
            .request(app)
            .post(timesheetsBaseRoute)
            .set('Authorization', authToken)
            .send(params);
          expect(response.statusCode).to.equal(400);
        });
        it('Without name should return error', async () => {
          const params = { ...timesheetParams };
          delete params.name;
          const response = await chai
            .request(app)
            .post(timesheetsBaseRoute)
            .set('Authorization', authToken)
            .send(params);
          expect(response.statusCode).to.equal(400);
        });
        it('Without search_keywords should return error', async () => {
          const params = { ...timesheetParams };
          delete params.search_keywords;
          const response = await chai
            .request(app)
            .post(timesheetsBaseRoute)
            .set('Authorization', authToken)
            .send(params);
          expect(response.statusCode).to.equal(400);
        });
      });
    });
  });
});