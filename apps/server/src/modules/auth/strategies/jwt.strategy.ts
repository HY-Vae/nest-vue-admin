import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayloadType } from '@/common/types/auth.type';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const secretOrKey = configService.get('jwt.secret');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: JwtPayloadType) {
    const { id } = payload;
    const token = req.headers.authorization?.slice(7) || '';
    return await this.authService.validateToken(id, token);
  }
}
