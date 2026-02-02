import { AuthService } from '@/modules/auth/auth.service';
import { LoginReqDto } from '@/modules/auth/dto/req-auth.dto';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userName',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    request: any,
    username: string,
    password: string,
  ): Promise<any> {
    const body: LoginReqDto = request.body;
    //   1. 验证验证码
    await this.authService.checkCaptcha(body.captchaId, body.captcha);
    return await this.authService.validateUser(username, password);
  }
}
