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
  CreateSysDictDto,
  GetSysDictListDto,
  UpdateSysDictDto,
} from './dto/req-sys-dict.dto';
import { SysDictService } from './sys-dict.service';

@ApiTags('用户字典')
@ApiBearerAuth()
@Controller('sys/dict')
export class SysDictController {
  constructor(private readonly sysDictService: SysDictService) {}

  @ApiOperation({
    summary: '创建用户字典',
  })
  @Permission('sys:dict:create')
  @Action({ title: '创建用户字典', action: ActionEnum.CREATE })
  @Post()
  create(@Body(CreateDtoPipe) createSysDictDto: CreateSysDictDto) {
    return this.sysDictService.create(createSysDictDto);
  }

  @ApiOperation({
    summary: '查询用户字典列表',
  })
  @Permission('sys:dict:list')
  @Get()
  findAll(@Query() query: GetSysDictListDto) {
    return this.sysDictService.findAll(query);
  }

  @ApiOperation({
    summary: '查询用户字典列表',
  })
  @Permission('sys:dict:list')
  @Get('options')
  findAllOptions() {
    return this.sysDictService.findAllOptions();
  }

  @ApiOperation({
    summary: '查询用户下拉框数据（缓存）',
  })
  @Permission('sys:dict:list')
  @Post('options')
  findDicts(@Body('codes') codes: string[]) {
    return this.sysDictService.findDicts(codes);
  }

  @ApiOperation({
    summary: '查询用户字典详情',
  })
  @Permission('sys:dict:detail')
  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.sysDictService.findOne(code);
  }

  @ApiOperation({
    summary: '更新用户字典',
  })
  @Permission('sys:dict:update')
  @Action({ title: '更新用户字典', action: ActionEnum.UPDATE })
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(UpdateDtoPipe) updateSysDictDto: UpdateSysDictDto,
  ) {
    return this.sysDictService.update(id, updateSysDictDto);
  }

  @ApiOperation({
    summary: '删除用户字典',
  })
  @Permission('sys:dict:remove')
  @Action({ title: '删除用户字典', action: ActionEnum.REMOVE })
  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.sysDictService.remove(code);
  }
}
