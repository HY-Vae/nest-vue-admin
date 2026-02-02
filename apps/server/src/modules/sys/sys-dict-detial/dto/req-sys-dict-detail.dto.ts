import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class GetSysDictDetailListDto extends PaginationDto {
  @ApiProperty({ description: '字典Code', required: true })
  @IsString()
  @IsNotEmpty()
  sysDictCode: string;

  @ApiProperty({ description: '字典名称', required: false })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty({ description: '字典值', required: false })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ description: '字典状态', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}

export class CreateSysDictDetailDto {
  @ApiProperty({ description: '字典Code', required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  sysDictCode: string;

  @ApiProperty({ description: '字典名称', required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  label: string;

  @ApiProperty({ description: '字典值', required: true })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: '排序', required: false })
  @IsNumber()
  @Type()
  sort: number;

  @ApiProperty({ description: '字典状态', required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1)
  status: string;

  @ApiProperty({ description: '字典描述', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  remark?: string;
}

export class UpdateSysDictDetailDto extends PartialType(
  CreateSysDictDetailDto,
) {}

export class RemoveSysDictDetailDto {
  @ApiProperty({ description: '字典id', required: true })
  @IsNumber()
  ids: number[];

  @ApiProperty({ description: '字典Code', required: true })
  @IsString()
  @IsNotEmpty()
  sysDictCode: string;
}
