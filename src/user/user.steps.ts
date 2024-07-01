import { Given, When, Then } from '@cucumber/cucumber';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { CreateUserInput } from './inputs/create-user.input';

let validUserData: CreateUserInput;
let response: request.Response;

Given('I have a valid user data', () => {
  validUserData = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
});

When('I submit the data to the user API', async () => {
  const app = global['app'];
  response = await request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: `
        mutation CreateUser($input: CreateUserInput!) {
          createUser(createUserInput: $input) {
            id
            username
          }
        }
      `,
      variables: {
        input: validUserData,
      },
    });
  if (response.status !== 200) {
    throw new Error(`Expected status 200 but received ${response.status}`);
  }
});

Then('I should receive a confirmation with the user ID', () => {
  const userId = response.body.data.createUser.id;
  if (!userId) {
    throw new Error('Expected user ID in the response');
  }
});
