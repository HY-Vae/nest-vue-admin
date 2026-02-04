import { Action } from '@/common/decorators/action.decorator';
import { Permission } from '@/common/decorators/permission.decorator';
import { ActionEnum } from '@/common/enums/action.enum';
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
  CreateSysDictDetailDto,
  GetSysDictDetailListDto,
  RemoveSysDictDetailDto,
  RemoveSysDictDetailsDto,
  UpdateSysDictDetailDto,
} from './dto/req-sys-dict-detail.dto';
import { SysDictDetailService } from './sys-dict-detail.service';

@ApiTags('用户字典详情')
@ApiBearerAuth()
@Controller('sys/dictDetail')
export class SysDictDetailController {
  constructor(private readonly sysDictDetailService: SysDictDetailService) {}

  @ApiOperation({ summary: '创建字典表详情' })
  @Action({ title: '创建字典表详情', action: ActionEnum.CREATE })
  @Permission('sys:dictDetail:create')
  @Post()
  create(@Body(CreateDtoPipe) createSysDictDetailDto: CreateSysDictDetailDto) {
    return this.sysDictDetailService.create(createSysDictDetailDto);
  }

  @Permission('sys:dictDetail:list')
  @Get()
  findAll(@Query() query: GetSysDictDetailListDto) {
    return this.sysDictDetailService.findAll(query);
  }

  @ApiOperation({ summary: '查询字典表详情详情' })
  @Permission('sys:dictDetail:detail')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sysDictDetailService.findOne(id);
  }

  @ApiOperation({ summary: '更新字典表详情' })
  @Action({ title: '更新字典表详情', action: ActionEnum.UPDATE })
  @Permission('sys:dictDetail:update')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(UpdateDtoPipe) updateSysDictDetailDto: UpdateSysDictDetailDto,
  ) {
    return this.sysDictDetailService.update(id, updateSysDictDetailDto);
  }

  @ApiOperation({ summary: '删除字典表详情' })
  @Action({ title: '删除字典表详情', action: ActionEnum.REMOVE })
  @Permission('sys:dictDetail:remove')
  @Delete(':id')
  async remove(@Param('id') id: number, @Body() body: RemoveSysDictDetailDto) {
    return this.sysDictDetailService.remove(id, body);
  }

  @ApiOperation({ summary: '批量删除字典表详情' })
  @Permission('sys:dictDetail:removes')
  @Action({ title: '批量删除字典表详情', action: ActionEnum.REMOVES })
  @Delete()
  removes(@Body() body: RemoveSysDictDetailsDto) {
    return this.sysDictDetailService.removes(body);
  }
}
