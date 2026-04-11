import { Action } from '@/common/decorators/action.decorator';
import { Permission } from '@/common/decorators/permission.decorator';
import { User } from '@/common/decorators/user.decorator';
import { ActionEnum } from '@/common/enums/action.enum';
import { CreateDtoPipe } from '@/common/pipes/createDto.pipe';
import { UpdateDtoPipe } from '@/common/pipes/updateDto.pipe';
import type { CurrentUserType } from '@/common/types/auth.type';
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
  CreateSysUserDto,
  GetSysUserListDto,
  UpdatePasswordDto,
  UpdateProfileDto,
  UpdateSysUserDto,
} from './dto/req-sys-user.dto';
import { SysUserService } from './sys-user.service';

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('sys/user')
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @ApiOperation({
    summary: '新增用户',
  })
  @Permission('sys:user:create')
  @Action({ title: '新增用户', action: ActionEnum.CREATE })
  @Post()
  create(@Body(CreateDtoPipe) createSysUserDto: CreateSysUserDto) {
    return this.sysUserService.create(createSysUserDto);
  }

  @ApiOperation({
    summary: '查询用户列表',
  })
  @Permission('sys:user:list')
  @Get()
  findAll(@Query() query: GetSysUserListDto) {
    return this.sysUserService.findAll(query);
  }

  @ApiOperation({
    summary: '获取用户选项列表',
  })
  @Get('options')
  getOptions() {
    return this.sysUserService.getOptions();
  }

  @ApiOperation({
    summary: '获取当前用户个人信息',
  })
  @Get('profile')
  getProfile(@User() user: CurrentUserType) {
    return this.sysUserService.getProfile(user.id);
  }

  @ApiOperation({
    summary: '更新个人信息',
  })
  @Patch('profile')
  updateProfile(
    @User() user: CurrentUserType,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.sysUserService.updateProfile(user.id, updateProfileDto);
  }

  @ApiOperation({
    summary: '修改密码',
  })
  @Patch('password')
  updatePassword(
    @User() user: CurrentUserType,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.sysUserService.updatePassword(user.id, updatePasswordDto);
  }

  @ApiOperation({
    summary: '查询用户详情',
  })
  @Permission('sys:user:detail')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sysUserService.findOne(id);
  }

  @ApiOperation({
    summary: '更新用户',
  })
  @Action({ title: '更新用户', action: ActionEnum.UPDATE })
  @Permission('sys:user:update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(UpdateDtoPipe) updateSysUserDto: UpdateSysUserDto,
  ) {
    return this.sysUserService.update(id, updateSysUserDto);
  }

  @ApiOperation({
    summary: '删除用户',
  })
  @Action({ title: '删除用户', action: ActionEnum.REMOVE })
  @Permission('sys:user:remove')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: CurrentUserType) {
    return this.sysUserService.remove(id, user.id);
  }
}
