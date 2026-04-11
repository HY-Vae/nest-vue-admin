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
  CreateSysTodoDto,
  GetSysTodoListDto,
  UpdateSysTodoDto,
} from './dto/req-sys-todo.dto';
import { SysTodoService } from './sys-todo.service';

@ApiTags('待办事项')
@ApiBearerAuth()
@Controller('sys/todo')
export class SysTodoController {
  constructor(private readonly sysTodoService: SysTodoService) {}

  // ========== 用户端接口 ==========

  @ApiOperation({ summary: '获取待办数量' })
  @Get('pending/count')
  getPendingCount(@User() user: CurrentUserType) {
    return this.sysTodoService.getPendingCount(user.id);
  }

  @ApiOperation({ summary: '获取待办列表' })
  @Get()
  findAll(@User() user: CurrentUserType, @Query() query: GetSysTodoListDto) {
    return this.sysTodoService.findAll(user.id, query);
  }

  @ApiOperation({ summary: '获取待办详情' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sysTodoService.findOne(id);
  }

  @ApiOperation({ summary: '完成待办' })
  @Post(':id/complete')
  complete(@Param('id') id: string, @User() user: CurrentUserType) {
    return this.sysTodoService.complete(id, user.id);
  }

  @ApiOperation({ summary: '取消待办' })
  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.sysTodoService.cancel(id);
  }

  // ========== 管理端接口 ==========

  @ApiOperation({ summary: '管理端获取待办列表' })
  @Permission('sys:todo:list')
  @Get('admin/list')
  findAllAdmin(@Query() query: GetSysTodoListDto) {
    return this.sysTodoService.findAllAdmin(query);
  }

  @ApiOperation({ summary: '新增待办' })
  @Permission('sys:todo:create')
  @Action({ title: '新增待办', action: ActionEnum.CREATE })
  @Post()
  create(
    @Body(CreateDtoPipe) createSysTodoDto: CreateSysTodoDto,
    @User() user: CurrentUserType,
  ) {
    return this.sysTodoService.create(createSysTodoDto, user.id);
  }

  @ApiOperation({ summary: '更新待办' })
  @Permission('sys:todo:update')
  @Action({ title: '更新待办', action: ActionEnum.UPDATE })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(UpdateDtoPipe) updateSysTodoDto: UpdateSysTodoDto,
  ) {
    return this.sysTodoService.update(id, updateSysTodoDto);
  }

  @ApiOperation({ summary: '删除待办' })
  @Permission('sys:todo:remove')
  @Action({ title: '删除待办', action: ActionEnum.REMOVE })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sysTodoService.remove(id);
  }
}
