import { JwtPayloadType } from '@/common/types/auth.type';
import { AuthService } from '@/modules/auth/auth.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
