import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

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
