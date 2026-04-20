import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/* 分页查询 */
export class GetSysPostListDto extends PaginationDto {
  @ApiPropertyOptional({ description: '岗位名称' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '岗位编码' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: '所属部门ID' })
  @IsString()
  @IsOptional()
  deptId?: string;

  @ApiPropertyOptional({ description: '是否包含子部门岗位', default: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeChildren?: boolean;

  @ApiPropertyOptional({ description: '启用状态' })
  @IsString()
  @IsOptional()
  status?: string;
}

/* 新增 */
export class CreateSysPostDto {
  @ApiProperty({ description: '岗位名称' })
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '岗位编码' })
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ description: '所属部门ID（null表示公司通用岗位）' })
  @IsString()
  @IsOptional()
  deptId?: string;

  @ApiPropertyOptional({ description: '是否负责人岗位', default: false })
  @IsBoolean()
  @IsOptional()
  isLeader?: boolean;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sort?: number;

  @ApiProperty({ description: '启用状态' })
  @MaxLength(1)
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ description: '备注' })
  @MaxLength(255)
  @IsString()
  @IsOptional()
  remark?: string;

  @ApiPropertyOptional({ description: '默认角色ID列表', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roleIds?: string[];
}

/* 编辑 */
export class UpdateSysPostDto extends PartialType(CreateSysPostDto) {}
