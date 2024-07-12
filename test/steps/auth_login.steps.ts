import { Given, When, Then } from '@cucumber/cucumber';
import * as request from 'supertest';
import { CucumberWorldHelper } from '../helpers/cucumberWorld.helper';
import should = require('should');
import { verifyResponse } from '../helpers/verifyResponse';

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
        mutation Authenticate($loginUserInput: LoginUserInputDto!) {
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
  'I should receive a success message',
  function (this: CucumberWorldHelper) {
    const authenticateData = this.response.body.data.authenticate;
    verifyResponse.call(this, 'authenticate', '200');
    should(authenticateData).have.property('access_token').which.is.a.String();
    should(authenticateData).have.property('refresh_token').which.is.a.String();
    should(authenticateData).have.property('status').which.is.a.Number();

    this.accessToken = authenticateData.access_token;
  },
);
