import { Public } from '@/common/decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { HealthService } from './health.service';

@ApiTags('健康检查')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @SkipThrottle()
  @Get()
  check() {
    return this.healthService.check();
  }

  @Public()
  @SkipThrottle()
  @Get('db')
  checkDatabase() {
    return this.healthService.checkDatabase();
  }

  @Public()
  @SkipThrottle()
  @Get('memory')
  checkMemory() {
    return this.healthService.checkMemory();
  }
}
