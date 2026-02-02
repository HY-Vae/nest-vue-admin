import { CommonBaseDto } from '@/common/dtos/common.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateSysMenuMetaDto {
  @ApiProperty({ description: '激活菜单', required: false })
  @IsString()
  @IsOptional()
  activeName?: string;

  @ApiProperty({ description: '是否缓存', required: false })
  @IsBoolean()
  keepAlive: boolean;

  @ApiProperty({ description: '是否默认菜单', required: false })
  @IsBoolean()
  defaultMenu: boolean;

  @ApiProperty({ description: '菜单标题', required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '菜单图标', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: '页签是否可关闭', required: false })
  @IsBoolean()
  closeTab: boolean;
}

export class GetSysMenuListDto extends PaginationDto {
  @ApiProperty({ description: '路由名称', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '菜单状态', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}

export class CreateSysMenuBtnDto {
  @ApiProperty({ description: '功能名称', required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @ApiProperty({ description: '权限值', required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  auth: string;
}

export class CreateSysMenuDto extends CommonBaseDto {
  @ApiProperty({ description: '父菜单', required: false })
  @IsNumber()
  @IsOptional()
  @Type()
  parentId?: number;

  @ApiProperty({ description: '路由名称', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '菜单路径', required: true })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({ description: '菜单权限值', required: true })
  @IsString()
  @IsNotEmpty()
  auth: string;

  @ApiProperty({ description: '是否隐藏', required: true })
  @IsBoolean()
  hidden: boolean;

  @ApiProperty({ description: '组件', required: true })
  @IsString()
  @IsNotEmpty()
  component: string;

  @ApiProperty({ description: '菜单状态', required: true })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: '排序', required: false })
  @IsNumber()
  @Type()
  sort: number;

  @ApiProperty({ description: '菜单描述', required: false })
  @IsString()
  @IsOptional()
  remark?: string;

  @ApiProperty({ description: '菜单信息', required: true })
  @ValidateNested()
  @Type(() => CreateSysMenuMetaDto)
  meta: CreateSysMenuMetaDto;

  @ApiProperty({ description: '功能权限', required: true })
  @ValidateNested({ each: true })
  @Type(() => CreateSysMenuBtnDto)
  @IsArray()
  menuBtns: CreateSysMenuBtnDto[];
}

export class UpdateSysMenuDto extends PartialType(CreateSysMenuDto) {}
