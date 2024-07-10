import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvService {
  getNodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }
}
