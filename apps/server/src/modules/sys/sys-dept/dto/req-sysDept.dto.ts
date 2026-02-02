import { PaginationDto } from '@/common/dtos/pagination.dto';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

/* 分页查询 */
export class GetSysDeptListDto extends PaginationDto {
  @ApiProperty({ description: '部门名称' })
  @IsString()
  @IsOptional()
  deptName?: string;

  @ApiProperty({ description: '部门编码' })
  @IsString()
  @IsOptional()
  deptCode?: string;

  @ApiProperty({ description: '启用状态' })
  @IsString()
  @IsOptional()
  status?: string;
}

/* 新增 */
export class CreateSysDeptDto {
  @ApiProperty({ description: '部门名称' })
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  deptName: string;

  @ApiProperty({ description: '部门编码' })
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  deptCode: string;

  @ApiProperty({ description: '启用状态' })
  @MaxLength(191)
  @IsString()
  @IsNotEmpty()
  status: string;
}

/* 编辑 */
export class UpdateSysDeptDto extends PartialType(CreateSysDeptDto) {}
