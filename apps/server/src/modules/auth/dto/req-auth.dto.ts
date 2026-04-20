import { Trim } from '@/common/decorators/trim';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ReqAuthDto {}
export class RefreshTokenDto {
  @ApiProperty({ description: '刷新令牌' })
  @Trim()
  @IsString()
  refreshToken: string;
}
export class LoginReqDto {
  @ApiProperty({ description: '验证码', required: true })
  @Trim()
  @IsString()
  captcha: string;

  @ApiProperty({ description: '验证码Id', required: true })
  @IsString()
  captchaId: string;

  @ApiProperty({ description: '用户名', required: true })
  @IsString()
  userName: string;

  @ApiProperty({ description: '密码', required: true })
  @IsString()
  password: string;
}

export class ChangeExpiredPasswordDto {
  @ApiProperty({ description: '用户ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: '旧密码' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: '新密码（6-20位，字母+数字）' })
  @IsString()
  @Length(6, 20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{6,20}$/, {
    message: '新密码必须包含字母和数字，长度6-20位',
  })
  newPassword: string;
}
