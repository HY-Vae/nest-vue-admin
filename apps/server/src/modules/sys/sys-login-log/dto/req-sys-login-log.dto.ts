import { PaginationDto } from '@/common/dtos/pagination.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

/* 分页查询 */
export class GetSysLoginLogListDto extends PaginationDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiPropertyOptional({ description: '登录IP' })
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiPropertyOptional({ description: '登录地点' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: '登录状态 (0成功 1失败)' })
  @IsString()
  @IsOptional()
  @IsIn(['0', '1'])
  status?: string;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsDateString()
  @IsOptional()
  endTime?: string;
}

/* 创建登录日志 */
export class CreateSysLoginLogDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  userName: string;

  @ApiPropertyOptional({ description: '用户ID' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: '登录IP' })
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiPropertyOptional({ description: '登录地点' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: '浏览器' })
  @IsString()
  @IsOptional()
  browser?: string;

  @ApiPropertyOptional({ description: '操作系统' })
  @IsString()
  @IsOptional()
  os?: string;

  @ApiProperty({ description: '登录状态 (0成功 1失败)' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: '失败原因' })
  @IsString()
  @IsOptional()
  message?: string;
}

/* 在线用户分页查询 */
export class GetOnlineUserListDto extends PaginationDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsString()
  @IsOptional()
  userName?: string;
}
