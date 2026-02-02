import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CommonBaseDto {
  @IsOptional()
  @IsString()
  createBy?: string;

  @IsOptional()
  @IsString()
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
