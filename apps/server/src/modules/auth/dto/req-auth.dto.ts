import { Trim } from '@/common/decorators/trim';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReqAuthDto {}
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
