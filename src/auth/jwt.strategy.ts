import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { Configuration } from '../utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Configuration.jwt.token.secret,
      expiresIn: Configuration.jwt.token.expiresIn,
    });
  }

  async validate(payload: any) {
    return { payload, userId: payload.sub };
  }
}
