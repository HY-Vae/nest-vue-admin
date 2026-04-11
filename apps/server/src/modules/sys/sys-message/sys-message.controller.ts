import { User } from '@/common/decorators/user.decorator';
import type { CurrentUserType } from '@/common/types/auth.type';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SysMessageService } from './sys-message.service';

@ApiTags('消息中心')
@ApiBearerAuth()
@Controller('sys/message')
export class SysMessageController {
  constructor(private readonly sysMessageService: SysMessageService) {}

  @ApiOperation({ summary: '获取消息汇总' })
  @Get('summary')
  getSummary(@User() user: CurrentUserType) {
    return this.sysMessageService.getSummary(user.id);
  }
}
