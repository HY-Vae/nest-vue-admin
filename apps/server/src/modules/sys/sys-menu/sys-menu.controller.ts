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
  CreateSysMenuDto,
  GetSysMenuListDto,
  UpdateSysMenuDto,
} from './dto/req-sys-menu.dto';
import { SysMenuService } from './sys-menu.service';

@ApiTags('系统菜单')
@ApiBearerAuth()
@Controller('sys/menu')
export class SysMenuController {
  constructor(private readonly sysMenuService: SysMenuService) {}

  @Permission('sys:menu:create')
  @ApiOperation({
    summary: '创建菜单',
  })
  @Action({ title: '创建菜单', action: ActionEnum.CREATE })
  @Post()
  create(@Body(CreateDtoPipe) createSysMenuDto: CreateSysMenuDto) {
    return this.sysMenuService.create(createSysMenuDto);
  }

  @Permission('sys:menu:list')
  @ApiOperation({
    summary: '查询菜单列表',
  })
  @Get()
  findAll(@Query() query: GetSysMenuListDto) {
    return this.sysMenuService.findAll(query);
  }

  @Permission('sys:menu:detail')
  @ApiOperation({
    summary: '查询菜单详情',
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sysMenuService.findOne(id);
  }

  @Permission('sys:menu:update')
  @ApiOperation({
    summary: '更新菜单',
  })
  @Action({ title: '更新菜单', action: ActionEnum.UPDATE })
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(UpdateDtoPipe) updateSysMenuDto: UpdateSysMenuDto,
  ) {
    return this.sysMenuService.update(id, updateSysMenuDto);
  }

  @Permission('sys:menu:remove')
  @ApiOperation({
    summary: '删除菜单',
  })
  @Action({ title: '删除菜单', action: ActionEnum.REMOVE })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.sysMenuService.remove(id);
  }
}
