import { Trim } from '@/common/decorators/trim';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/* 分页查询 */
export class GetFileUploadListDto extends PaginationDto {
  @ApiProperty({ description: '文件名' })
  @IsString()
  @IsOptional()
  @Trim()
  name?: string;

  @ApiProperty({ description: '文件标签' })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiProperty({ description: 'MIME类型' })
  @IsString()
  @IsOptional()
  mime?: string;
}

/* 新增 */
export class CreateFileUploadDto {}

/* 编辑 */
export class UpdateFileUploadDto extends PartialType(CreateFileUploadDto) {}
