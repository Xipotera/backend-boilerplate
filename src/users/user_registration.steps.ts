import { Given, When, Then } from '@cucumber/cucumber';
import * as request from 'supertest';
import { CucumberWorldHelper } from '../../test/helpers/cucumberWorld.helper'; // Correct import for `should`
import should = require('should');

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
  'I should receive a confirmation with the user ID',
  function (this: CucumberWorldHelper) {
    this.response.status.should.equal(200);
    should(this.response).have.property('body');
    const registerData = this.response.body.data.register;
    should(registerData).have.property('id').which.is.a.String();
    should(registerData).have.property('status').which.is.a.Number();
    registerData.status.should.equal(201);
    should(registerData.id).not.be.null();
    should(registerData.id).not.be.undefined();
    this.emailToken = registerData?.token;
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
        mutation VerifyEmail($token: String!) {
          verifyEmail(token: $token) {
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
