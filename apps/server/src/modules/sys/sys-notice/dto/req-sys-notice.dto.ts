import { PaginationDto } from '@/common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetSysNoticeListDto extends PaginationDto {
  @ApiProperty({ description: '标题', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '类型', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: '状态', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class GetUserNoticeListDto extends PaginationDto {
  @ApiProperty({ description: '已读状态', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isRead?: boolean;
}

export class CreateSysNoticeDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  content: string;

  @ApiProperty({ description: '类型', required: false, default: 'notice' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: '状态', required: false, default: '0' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateSysNoticeDto {
  @ApiProperty({ description: '标题', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '内容', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '类型', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: '状态', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
