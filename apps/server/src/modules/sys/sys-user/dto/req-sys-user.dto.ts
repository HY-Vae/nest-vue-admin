import { PaginationDto } from '@/common/dtos/pagination.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class GetSysUserListDto extends PaginationDto {
  @ApiProperty({ description: '用户名', required: false })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({ description: '手机号', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class CreateSysUserDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  userName: string;

  @ApiProperty({ description: '头像地址', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: '邮箱',
    example: 'admin@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: '昵称', example: '系统管理员' })
  @IsString()
  nickName: string;

  // @ApiProperty({ description: '密码', example: '123456' })
  // @IsString()
  // password: string;

  @ApiProperty({
    description: '手机号',
    example: '13800138000',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: '性别(0男 1女 2未知)',
    example: '0',
    required: false,
  })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiProperty({
    description: '状态(0正常 1停用)',
    example: '0',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: '用户类型(00系统用户)',
    example: '00',
    required: false,
  })
  @IsOptional()
  @IsString()
  userType?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ description: '角色ID', required: false })
  @IsArray()
  @IsString({ each: true })
  roleIds: string[];
}

export class UpdateSysUserDto extends PartialType(CreateSysUserDto) {}
