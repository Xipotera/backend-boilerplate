import { Given, When, Then } from '@cucumber/cucumber';
import * as request from 'supertest';
import { CucumberWorldHelper } from '../helpers/cucumberWorld.helper'; // Correct import for `should`
import should = require('should');
import { verifyResponse } from '../helpers/verifyResponse';

Given('I have a valid user data', function (this: CucumberWorldHelper) {
  this.validUserData = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@domain.com',
    password: '!MPgh73ez',
  };
});

When(
  'I submit the data to the user API',
  async function (this: CucumberWorldHelper) {
    const app = global['app'];
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Register($createUserInput: CreateUserDto!) {
          register(createUserInput: $createUserInput) {
            id
            token
            message
            status
          }
        }
      `,
        variables: {
          createUserInput: this.validUserData,
        },
      });
    this.response = response;
  },
);

Then(
  'I should receive user from query {string} with status {string}',
  function (
    this: CucumberWorldHelper,
    operation: string,
    expectedStatus: string,
  ) {
    const UserData = this.response.body.data[operation];
    verifyResponse.call(this, operation, expectedStatus);

    if (operation === 'register') {
      should(UserData).have.property('id').which.is.a.String();
      should(UserData.id).not.be.null();
      should(UserData.id).not.be.undefined();
      if (UserData?.token) {
        this.emailToken = UserData?.token;
      }
    }
  },
);

Given(
  'I have a token to verify the email',
  function (this: CucumberWorldHelper) {
    should(this.emailToken).not.be.null();
    should(this.emailToken).not.be.undefined();
  },
);

When(
  'I submit the token to the auth API',
  async function (this: CucumberWorldHelper) {
    const app = global['app'];
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation VerifyEmailToken($token: String!) {
          verifyEmailToken(token: $token) {
            message
            status
          } 
        }
      `,
        variables: {
          token: this.emailToken,
        },
      });
    this.response = response;
  },
);
