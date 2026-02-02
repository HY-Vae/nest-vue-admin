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

/* 分页查询 */
export class GetSysActionLogListDto extends PaginationDto {
      
  @ApiProperty({ description: '标题', required: false })
  @IsString()
  @IsOptional()
  
  title?: string;
  
      
  @ApiProperty({ description: '操作类型', required: false })
  @IsString()
  @IsOptional()
  
  action?: string;
  
      
  @ApiProperty({ description: 'IP', required: false })
  @IsString()
  @IsOptional()
  
  ip?: string;
  
      
  @ApiProperty({ description: '地址', required: false })
  @IsString()
  @IsOptional()
  
  address?: string;
  
      
  @ApiProperty({ description: '姓名', required: false })
  @IsString()
  @IsOptional()
  
  userName?: string;
  
      
  @ApiProperty({ description: '状态', required: false })
  @IsString()
  @IsOptional()
  
  status?: string;
  
}

  /* 新增 */
export class CreateSysActionLogDto {
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}

/* 编辑 */
export class UpdateSysActionLogDto extends PartialType(CreateSysActionLogDto) {}
