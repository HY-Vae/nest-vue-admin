import { Permission } from '@/common/decorators/permission.decorator';
import type { ExportColumn } from '@/common/class/export.class';
import { CreateDtoPipe } from '@/common/pipes/createDto.pipe';
import { UpdateDtoPipe } from '@/common/pipes/updateDto.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import {
  CreateSysPostDto,
  GetSysPostListDto,
  UpdateSysPostDto,
} from './dto/req-sys-post.dto';
import { SysPostService } from './sys-post.service';

@ApiTags('岗位管理')
@ApiBearerAuth()
@Controller('sys/post')
export class SysPostController {
  constructor(private readonly sysPostService: SysPostService) {}

  @ApiOperation({
    summary: '新增岗位',
  })
  @Permission('sys:post:create')
  @Post()
  create(@Body(CreateDtoPipe) createSysPostDto: CreateSysPostDto) {
    return this.sysPostService.create(createSysPostDto);
  }

  @ApiOperation({
    summary: '查询岗位列表',
  })
  @Permission('sys:post:list')
  @Get()
  findAll(@Query() query: GetSysPostListDto) {
    return this.sysPostService.findAll(query);
  }

  @ApiOperation({
    summary: '导出岗位列表',
  })
  @Permission('sys:post:export')
  @Post('export')
  exportExcel(
    @Body() body: { fields: ExportColumn[] },
    @Query() query: GetSysPostListDto,
    @Res() res: Response,
  ) {
    return this.sysPostService.exportExcel(body.fields, query, res);
  }

  @ApiOperation({
    summary: '获取岗位选项',
  })
  @Get('options')
  getOptions(@Query('deptId') deptId?: string) {
    return this.sysPostService.getOptions(deptId);
  }

  @ApiOperation({
    summary: '查询岗位详情',
  })
  @Permission('sys:post:detail')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sysPostService.findOne(id);
  }

  @ApiOperation({
    summary: '更新岗位',
  })
  @Permission('sys:post:update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(UpdateDtoPipe) updateSysPostDto: UpdateSysPostDto,
  ) {
    return this.sysPostService.update(id, updateSysPostDto);
  }

  @ApiOperation({
    summary: '删除岗位',
  })
  @Permission('sys:post:remove')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sysPostService.remove(id);
  }

  @ApiOperation({
    summary: '批量删除岗位',
  })
  @Permission('sys:post:remove')
  @Delete('batch')
  removes(@Body() body: { ids: string[] }) {
    return this.sysPostService.removes(body.ids);
  }
}
