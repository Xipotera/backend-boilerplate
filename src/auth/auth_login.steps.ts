import { Given, When, Then } from '@cucumber/cucumber';
import * as request from 'supertest';
import { CucumberWorldHelper } from '../../test/helpers/cucumberWorld.helper';
import should = require('should');

Given(
  'I have valid login credentials',
  async function (this: CucumberWorldHelper) {
    this.loginCredentials = {
      email: 'john.doe@domain.com',
      password: '!MPgh73ez',
    };
  },
);

Given(
  'I have invalid login credentials',
  async function (this: CucumberWorldHelper) {
    this.loginCredentials = {
      email: 'john.doe@domain.com',
      password: 'wrongpassword',
    };
  },
);

When(
  'I submit the authenticate request to the auth API',
  async function (this: CucumberWorldHelper) {
    const app = global['app'];
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Authenticate($loginUserInput: LoginUserDto!) {
          authenticate(loginUserInput: $loginUserInput) {
            access_token
            refresh_token
            status
          }
        }
      `,
        variables: {
          loginUserInput: this.loginCredentials,
        },
      });
    this.response = response;
  },
);

Then(
  'I should receive an error message with the reason {string}',
  function (this: CucumberWorldHelper, expectedReason: string) {
    should(this.response).have.property('body');
    should(this.response.body).have.property('errors');

    const errors = this.response.body.errors;
    should(errors).be.Array();
    should(errors[0]).have.property('message').which.is.a.String();
    should(errors[0]).have.property('extensions');
    should(errors[0].extensions).have.property('code').which.is.a.String();

    const statusCode = errors[0].extensions.code;

    statusCode.should.equal(expectedReason);
  },
);

Then(
  'I should receive an success message',
  function (this: CucumberWorldHelper) {
    should(this.response).have.property('body');
    const authenticateData = this.response.body.data.authenticate;
    should(authenticateData).have.property('access_token').which.is.a.String();
    should(authenticateData).have.property('refresh_token').which.is.a.String();
    should(authenticateData).have.property('status').which.is.a.Number();
    authenticateData.status.should.equal(200);
  },
);
