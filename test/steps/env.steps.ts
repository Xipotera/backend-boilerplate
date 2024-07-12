import { Given, When, Then } from '@cucumber/cucumber';
import * as request from 'supertest';

let response: request.Response;

Given('the backend is running', async () => {
  // No setup needed as the backend is started globally
});

When('I request the NODE_ENV', async () => {
  const app = global['app'];
  response = await request(app.getHttpServer()).get('/env');
});

Then('I should receive the NODE_ENV value', () => {
  if (response.status !== 200) {
    throw new Error(`Expected status 200 but received ${response.status}`);
  }
  const nodeEnv = response.body.nodeEnv;
  if (!nodeEnv) {
    throw new Error('Expected NODE_ENV in the response');
  }
});
