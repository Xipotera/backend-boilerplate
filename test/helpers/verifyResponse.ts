import should = require('should');
import { CucumberWorldHelper } from './cucumberWorld.helper';

export function verifyResponse(
  this: CucumberWorldHelper,
  operation: string,
  expectedStatus: string,
) {
  this.response.status.should.equal(200);
  should(this.response).have.property('body');
  const UserData = this.response.body.data[operation];
  should(UserData).have.property('status').which.is.a.Number();
  UserData.status.should.equal(Number(expectedStatus));
}
