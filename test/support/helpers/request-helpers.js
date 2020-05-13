const baseApiV1Routes = '/api/v1/';

const getBearerTokenFromAuthentication = async ({ email, app, chai }) => {
  const response = await chai
    .request(app)
    .post(`${baseApiV1Routes}sign-in`)
    .send({ email, password: '123456789' });
  return `Bearer ${response.body.jwt}`;
};

module.exports = {
  baseApiV1Routes,
  getBearerTokenFromAuthentication,
}