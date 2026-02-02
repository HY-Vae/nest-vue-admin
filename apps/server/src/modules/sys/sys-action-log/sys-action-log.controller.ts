import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SysActionLogService } from './sys-action-log.service';
import {
  CreateSysActionLogDto,
  GetSysActionLogListDto,
  UpdateSysActionLogDto,
} from './dto/req-sysActionLog.dto';
import { Permission } from '@/common/decorators/permission.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDtoPipe } from '@/common/pipes/createDto.pipe';
import { UpdateDtoPipe } from '@/common/pipes/updateDto.pipe';

import {
  DelCommonNumberDto,
  DelCommonNumbersDto,
} from '@/common/dtos/common.dto';

@ApiTags('操作日志')
@ApiBearerAuth()
@Controller('sys/sys-action-log')
export class SysActionLogController {
  constructor(private readonly sysActionLogService: SysActionLogService) {}

  /* 列表查询 */
  @Get()
  @ApiOperation({
    summary: '查询操作日志列表',
  })
  @Permission('sys:sys-action-log:list')
  async findAll(@Query() getSysActionLogListDto: GetSysActionLogListDto) {
    return this.sysActionLogService.findAll(getSysActionLogListDto);
  }

  /* 通过id查询 */
  @Get(':id')
  @ApiOperation({
    summary: '查询操作日志详情',
  })
  @ApiParam({ name: 'id', description: '操作日志id' })
  @Permission('sys:sys-action-log:detail')
  async findOne(@Param('id') id: number) {
    return await this.sysActionLogService.findOne(id);
  }
}
