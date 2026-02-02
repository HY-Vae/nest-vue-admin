import { CommonBaseDto } from '@/common/dtos/common.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import {
  FieldTypeEnum,
  GenTypeEnum,
  SearchTypeEnum,
} from '@/common/enums/gen.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DecimalDto {
  @IsNumber()
  @IsNotEmpty()
  @Type()
  precision: number;

  @IsNumber()
  @IsNotEmpty()
  @Type()
  scale: number;
}

export class FieldDto {
  @IsString()
  @IsNotEmpty()
  nameCh: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nameJson: string;

  @IsString()
  @IsNotEmpty()
  dataName: string;

  @IsEnum(FieldTypeEnum)
  type: FieldTypeEnum;

  @IsBoolean()
  isRequired: boolean;

  @IsBoolean()
  isSearch: boolean;

  @IsBoolean()
  isPrimary: boolean;

  @IsBoolean()
  isTranslate: boolean;

  @IsBoolean()
  isAutoIncrement: boolean;

  @IsBoolean()
  isAdd: boolean;

  @IsBoolean()
  isShowTable: boolean;

  @IsBoolean()
  isUnique: boolean;

  @IsEnum(SearchTypeEnum)
  @IsOptional()
  searchType?: SearchTypeEnum;

  @IsString()
  @IsOptional()
  defaultValue?: string;

  @IsString()
  @IsOptional()
  prismaOther?: string;

  @IsString()
  @IsOptional()
  tsType?: string;

  @IsNumber()
  @IsOptional()
  size?: number;

  @IsEnum(GenTypeEnum)
  formItemType: GenTypeEnum;

  @IsString()
  @IsOptional()
  dictCode?: string;

  @ValidateNested({ each: true })
  @IsOptional()
  decimal?: DecimalDto;
}

// 主 DTO
export class CreateAutoCodeDto extends CommonBaseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nameZh: string;

  @IsString()
  @IsNotEmpty()
  modelName: string;

  @IsString()
  @IsNotEmpty()
  webPath: string;

  @IsString()
  @IsNotEmpty()
  tempId: string;

  @IsString()
  @IsNotEmpty()
  routePath: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  fields: FieldDto[];
}

/* 分页查询 */
export class GetAutoCodeListDto extends PaginationDto {
  @ApiProperty({ description: '模块code' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '模块中文名称' })
  @IsString()
  @IsOptional()
  nameZh?: string;

  @ApiProperty({ description: '模板目录' })
  @IsString()
  @IsOptional()
  tempId?: string;
}
