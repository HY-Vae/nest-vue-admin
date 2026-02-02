import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SysMenuService } from './sys-menu.service';
import {
  CreateSysMenuDto,
  GetSysMenuListDto,
  UpdateSysMenuDto,
} from './dto/req-sys-menu.dto';
import { Permission } from '@/common/decorators/permission.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDtoPipe } from '@/common/pipes/createDto.pipe';
import { UpdateDtoPipe } from '@/common/pipes/updateDto.pipe';

@ApiTags('系统菜单')
@ApiBearerAuth()
@Controller('sys/menu')
export class SysMenuController {
  constructor(private readonly sysMenuService: SysMenuService) {}

  @Permission('sys:menu:create')
  @ApiOperation({
    summary: '创建菜单',
  })
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
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.sysMenuService.remove(id);
  }
}
