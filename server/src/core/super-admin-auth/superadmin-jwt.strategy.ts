import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';


@Injectable()
export class SuperAdminJwtStrategy extends PassportStrategy(Strategy, 'superadmin-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_URL}/.well-known/jwks.json`,
      }),
      issuer: `https://${process.env.AUTH0_URL}/`,
      audience: `https://${process.env.SUPERADMIN_AUTH0_AUDIENCE}`,
    });
  }

  async validate(payload: any) {
      

    return payload;
  }
}