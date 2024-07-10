import {
  setWorldConstructor,
  World as CucumberWorld,
  IWorldOptions,
} from '@cucumber/cucumber';

interface CustomWorld extends CucumberWorld {
  response: any;
  emailToken: string;
  loginCredentials?: { email: string; password: string };
  validUserData?: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  };
}

class CucumberWorldHelper extends CucumberWorld implements CustomWorld {
  response: any;
  loginCredentials?: { email: string; password: string };
  emailToken: string;
  validUserData?: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  };

  constructor(options: IWorldOptions) {
    super(options);
    this.response = {};
    this.emailToken = '';
  }
}

setWorldConstructor(CucumberWorldHelper);
export { CucumberWorldHelper };
