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
import { SysRoleService } from './sys-role.service';
import {
  CreateSysRoleDto,
  GetSysRoleListDto,
  UpdateSysRoleDto,
} from './dto/req-sys-role.dto';
import { Permission } from '@/common/decorators/permission.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDtoPipe } from '@/common/pipes/createDto.pipe';
import { UpdateDtoPipe } from '@/common/pipes/updateDto.pipe';
import { Action } from '@/common/decorators/action.decorator';
import { ActionEnum } from '@/common/enums/action.enum';

@ApiTags('用户角色')
@ApiBearerAuth()
@Controller('sys/role')
export class SysRoleController {
  constructor(private readonly sysRoleService: SysRoleService) {}

  @Permission('sys:role:create')
  @ApiOperation({
    summary: '新增角色',
  })
  @Action({ action: ActionEnum.CREATE, title: '新增角色' })
  @Post()
  create(@Body(CreateDtoPipe) createSysRoleDto: CreateSysRoleDto) {
    return this.sysRoleService.create(createSysRoleDto);
  }

  @Permission('sys:role:list')
  @ApiOperation({
    summary: '查询角色列表',
  })
  @Get()
  findAll(@Query() query: GetSysRoleListDto) {
    return this.sysRoleService.findAll(query);
  }

  @Permission('sys:role:list')
  @ApiOperation({
    summary: '查询角色下拉框',
  })
  @Get('options')
  findAllOptions() {
    return this.sysRoleService.findAllOptions();
  }

  @Permission('sys:role:list')
  @ApiOperation({
    summary: '查询角色详情',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sysRoleService.findOne(id);
  }

  @Permission('sys:role:update')
  @ApiOperation({
    summary: '更新角色',
  })
  @Action({ action: ActionEnum.UPDATE, title: '更新角色' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(UpdateDtoPipe) updateSysRoleDto: UpdateSysRoleDto,
  ) {
    return this.sysRoleService.update(id, updateSysRoleDto);
  }

  @Permission('sys:role:remove')
  @ApiOperation({
    summary: '批量删除角色',
  })
  @Action({ action: ActionEnum.REMOVES, title: '批量删除角色' })
  @Delete()
  remove(@Body('ids') ids: string[]) {
    return this.sysRoleService.remove(ids);
  }
}
