import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@/modules/auth/strategies/local.strategy';
import { SysLoginLogModule } from '@/modules/sys/sys-login-log/sys-login-log.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
    SysLoginLogModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
