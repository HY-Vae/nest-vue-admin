import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CommonBaseDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  createBy?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  updateBy?: string;
}

export class DelCommonStringDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class DelCommonStringsDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  ids: string[];
}

export class DelCommonNumberDto {
  @IsNumber()
  @IsNotEmpty()
  @Type()
  @Min(1)
  id: number;
}

export class DelCommonNumbersDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @IsNotEmpty()
  @Type()
  ids: number[];
}
