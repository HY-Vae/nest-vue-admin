import { PaginationDto } from '@/common/dtos/pagination.dto';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class GetSysDictListDto extends PaginationDto {
  @ApiProperty({ description: '字典名称', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '字典值', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: '字典状态', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}

export class CreateSysDictDto {
  @ApiProperty({ description: '字典名称', required: true })
  @IsString()
  @MaxLength(30)
  name: string;

  @ApiProperty({ description: '字典值', required: true })
  @IsString()
  @MaxLength(30)
  code: string;

  @ApiProperty({ description: '排序', required: false })
  @IsNumber()
  @Type()
  sort: number;

  @ApiProperty({ description: '字典状态', required: true })
  @IsString()
  @MaxLength(1)
  status: string;

  @ApiProperty({ description: '字典描述', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  remark?: string;
}

export class UpdateSysDictDto extends PartialType(CreateSysDictDto) {}
