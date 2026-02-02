import { Permission } from '@/common/decorators/permission.decorator';
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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateTempDto,
  GetTempListDto,
  UpdateTempDto,
} from './dto/req-temp.dto';
import { TempService } from './temp.service';

import { User } from '@/common/decorators/user.decorator';
import type { CurrentUserType } from '@/common/types/auth.type';
import { getRelativePath } from '@/utils/util';

@ApiTags('模板')
@ApiBearerAuth()
@Controller('tool/temp')
export class TempController {
  constructor(private readonly tempService: TempService) {}

  @Permission('tool:temp:create')
  @ApiOperation({
    summary: '新增模板',
  })
  @Post()
  create(
    @Body(CreateDtoPipe) createTempDto: CreateTempDto,
    @User() user: CurrentUserType,
  ) {
    createTempDto.tempPath = getRelativePath(createTempDto.tempPath);
    createTempDto.code = getRelativePath(createTempDto.code);
    return this.tempService.create(createTempDto, user);
  }

  @Permission('tool:temp:list')
  @ApiOperation({
    summary: '查询模板列表',
  })
  @Get()
  findAll(@Query() query: GetTempListDto) {
    return this.tempService.findAll(query);
  }

  @Permission('tool:temp:list')
  @ApiOperation({
    summary: '查询模板列表',
  })
  @Get('options')
  findOptions() {
    return this.tempService.findOptions();
  }

  @Permission('tool:temp:detail')
  @ApiOperation({
    summary: '查询模板详情',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tempService.findOne(id);
  }

  @Permission('tool:temp:update')
  @ApiOperation({
    summary: '更新模板',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(UpdateDtoPipe) updateTempDto: UpdateTempDto,
  ) {
    return this.tempService.update(id, updateTempDto);
  }

  @Permission('tool:temp:remove')
  @ApiOperation({
    summary: '删除模板',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tempService.remove(id);
  }

  @Permission('tool:temp:removes')
  @ApiOperation({
    summary: '批量删除模板',
  })
  @Delete()
  removes(@Body('ids') ids: string[]) {
    return this.tempService.removes(ids);
  }
}
