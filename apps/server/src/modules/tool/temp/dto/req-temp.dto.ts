import { PaginationDto } from '@/common/dtos/pagination.dto';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class GetTempListDto extends PaginationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;
}

export class CreateTempDto {
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  code: string;

  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  tempPath: string;
}

export class UpdateTempDto extends PartialType(CreateTempDto) {}
