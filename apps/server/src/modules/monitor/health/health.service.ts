import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'up', info: { database: { status: 'up' } } };
    } catch {
      return { status: 'down', info: { database: { status: 'down' } } };
    }
  }

  async checkMemory() {
    const mem = process.memoryUsage();
    return {
      status: 'up',
      info: {
        memory: {
          status: 'up',
          rss: `${(mem.rss / 1024 / 1024).toFixed(2)} MB`,
          heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`,
          heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        },
      },
    };
  }

  async check() {
    const [db, memory] = await Promise.all([
      this.checkDatabase(),
      this.checkMemory(),
    ]);

    const isUp = db.status === 'up' && memory.status === 'up';

    return {
      status: isUp ? 'ok' : 'error',
      info: {
        ...db.info,
        ...memory.info,
      },
    };
  }
}
