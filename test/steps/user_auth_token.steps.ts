import { Given, Then, When } from '@cucumber/cucumber';
import { CucumberWorldHelper } from '../helpers/cucumberWorld.helper';
import should = require('should');
import * as request from 'supertest';
import { verifyResponse } from '../helpers/verifyResponse';

Given('I have valid access token', function (this: CucumberWorldHelper) {
  should(this.accessToken).not.be.null();
  should(this.accessToken).not.be.undefined();
});

When(
  'I submit the access token request to the auth API',
  async function (this: CucumberWorldHelper) {
    const app = global['app'];
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${this.accessToken}`)
      .send({
        query: `
        query GetUserFromToken {
          getUserFromToken {
            id
            status
            message
          }
        }
      `,
      });
    this.response = response;
  },
);

Then(
  'I should receive a success message with user data',
  function (this: CucumberWorldHelper) {
    const UserData = this.response.body.data.getUserFromToken;
    verifyResponse.call(this, 'getUserFromToken', '200');
    should(UserData).have.property('id').which.is.a.String();
    should(UserData.id).not.be.null();
    should(UserData.id).not.be.undefined();
  },
);
