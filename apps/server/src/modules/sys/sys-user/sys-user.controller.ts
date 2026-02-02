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
import {
  CreateSysUserDto,
  GetSysUserListDto,
  UpdateSysUserDto,
} from './dto/req-sys-user.dto';
import { SysUserService } from './sys-user.service';

@Controller('sys/user')
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @Post()
  @Permission('sys:user:create')
  create(@Body(CreateDtoPipe) createSysUserDto: CreateSysUserDto) {
    return this.sysUserService.create(createSysUserDto);
  }

  @Get()
  @Permission('sys:user:list')
  findAll(@Query() query: GetSysUserListDto) {
    return this.sysUserService.findAll(query);
  }

  @Get(':id')
  @Permission('sys:user:list')
  findOne(@Param('id') id: string) {
    return this.sysUserService.findOne(id);
  }

  @Patch(':id')
  @Permission('sys:user:update')
  update(
    @Param('id') id: string,
    @Body(UpdateDtoPipe) updateSysUserDto: UpdateSysUserDto,
  ) {
    return this.sysUserService.update(id, updateSysUserDto);
  }

  @Delete(':id')
  @Permission('sys:user:remove')
  remove(@Param('id') id: string) {
    return this.sysUserService.remove(id);
  }
}
