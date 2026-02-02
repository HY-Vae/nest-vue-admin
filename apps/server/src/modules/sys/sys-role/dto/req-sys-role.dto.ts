import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class GetSysRoleListDto extends PaginationDto {
  @ApiProperty({ description: '角色名称', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '角色状态', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}

export class CreateSysRoleDto {
  @ApiProperty({ description: '角色名称', required: true })
  @IsString()
  @MaxLength(30)
  name: string;

  @ApiProperty({ description: '角色权限值', required: true })
  @IsString()
  @MaxLength(30)
  key: string;

  @ApiProperty({ description: '排序', required: false })
  @IsNumber()
  @Type()
  sort: number;

  @ApiProperty({ description: '角色状态', required: true })
  @IsString()
  @MaxLength(1)
  status: string;

  @ApiProperty({ description: '角色描述', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  remark?: string;

  @ApiProperty({ description: '菜单权限', required: true })
  @IsArray()
  menus: number[];

  @ApiProperty({ description: '接口权限', required: true })
  @IsArray()
  menuBtns: number[];
}

export class UpdateSysRoleDto extends PartialType(CreateSysRoleDto) {}
