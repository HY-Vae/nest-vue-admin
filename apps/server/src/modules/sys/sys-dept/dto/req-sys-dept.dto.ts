import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/* 分页查询 */
export class GetSysDeptListDto extends PaginationDto {
  @ApiPropertyOptional({ description: '部门名称' })
  @IsString()
  @IsOptional()
  deptName?: string;

  @ApiPropertyOptional({ description: '部门编码' })
  @IsString()
  @IsOptional()
  deptCode?: string;

  @ApiPropertyOptional({ description: '启用状态' })
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

  @ApiPropertyOptional({ description: '父级部门ID' })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sort?: number;

  @ApiProperty({ description: '启用状态' })
  @MaxLength(191)
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ description: '备注' })
  @MaxLength(255)
  @IsString()
  @IsOptional()
  remark?: string;
}

/* 编辑 */
export class UpdateSysDeptDto extends PartialType(CreateSysDeptDto) {}
