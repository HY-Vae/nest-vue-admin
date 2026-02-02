import { Permission } from '@/common/decorators/permission.decorator';
import { User } from '@/common/decorators/user.decorator';
import { CreateDtoPipe } from '@/common/pipes/createDto.pipe';
import type { CurrentUserType } from '@/common/types/auth.type';
import { AutoCodeService } from '@/modules/tool/auto-code/auto-code.service';
import {
  CreateAutoCodeDto,
  GetAutoCodeListDto,
} from '@/modules/tool/auto-code/dto/req-auto-code.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('tool/auto-code')
export class AutoCodeController {
  constructor(private readonly autoCodeService: AutoCodeService) {}

  @Permission('tool:auto-code:create')
  @ApiOperation({
    summary: '生成代码',
  })
  @Post()
  create(
    @Body(CreateDtoPipe) createAutoCodeDto: CreateAutoCodeDto,
    @User() user: CurrentUserType,
  ) {
    return this.autoCodeService.create(createAutoCodeDto, user);
  }

  @Permission('tool:auto-code:create')
  @ApiOperation({
    summary: '生成代码',
  })
  @Post('web')
  createWeb(
    @Body(CreateDtoPipe) createAutoCodeDto: CreateAutoCodeDto,
    @User() user: CurrentUserType,
  ) {
    return this.autoCodeService.createWeb(createAutoCodeDto, user);
  }

  /* 列表查询 */
  @Get()
  @ApiOperation({
    summary: '查询生成列表列表',
  })
  @Permission('tool:auto-code:list')
  async findAll(@Query() getAutoCodeListDto: GetAutoCodeListDto) {
    return this.autoCodeService.findAll(getAutoCodeListDto);
  }

  /* 通过id查询 */
  @Get(':id')
  @ApiOperation({
    summary: '查询生成列表详情',
  })
  @ApiParam({ name: 'id', description: '生成列表id' })
  @Permission('tool:auto-code:detail')
  async findOne(@Param('id') id: number) {
    return await this.autoCodeService.findOne(id);
  }

  /* 单个删除 */
  @Delete(':id')
  @ApiOperation({
    summary: '删除生成列表',
  })
  @ApiParam({ name: 'id', description: '生成列表id' })
  @Permission('tool:auto-code:remove')
  async remove(@Param('id') id: number) {
    return this.autoCodeService.remove(id);
  }

  /* 批量删除 */
  @Delete()
  @ApiOperation({
    summary: '批量删除生成列表',
  })
  @Permission('tool:auto-code:removes')
  async removes(@Body('ids') ids: number[]) {
    return this.autoCodeService.removes(ids);
  }
}
