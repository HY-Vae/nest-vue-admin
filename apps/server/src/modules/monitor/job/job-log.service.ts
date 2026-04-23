import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { GetJobLogListDto } from './dto/req-job.dto';

@Injectable()
export class JobLogService {
  constructor(private readonly prisma: PrismaService) {}

  /* 分页查询任务日志 */
  async findAll(query: GetJobLogListDto) {
    const { skip, take } = query;
    const where: Prisma.SysJobLogWhereInput = {};

    if (query.jobName) {
      where.jobName = { contains: query.jobName };
    }
    if (query.jobGroup) {
      where.jobGroup = { contains: query.jobGroup };
    }
    if (query.status !== undefined) {
      where.status = query.status;
    }
    if (query.startTime || query.endTime) {
      where.createdAt = {};
      if (query.startTime) {
        where.createdAt.gte = new Date(query.startTime);
      }
      if (query.endTime) {
        where.createdAt.lte = new Date(query.endTime);
      }
    }

    const [list, total] = await Promise.all([
      this.prisma.sysJobLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.sysJobLog.count({ where }),
    ]);

    return { list, total };
  }

  /* 查询日志详情 */
  async findOne(id: number) {
    return this.prisma.sysJobLog.findUnique({ where: { id } });
  }

  /* 批量删除日志 */
  async removes(ids: number[]) {
    return this.prisma.sysJobLog.deleteMany({
      where: { id: { in: ids } },
    });
  }

  /* 清空日志 */
  async clean() {
    return this.prisma.sysJobLog.deleteMany();
  }

  /* 创建日志（内部方法） */
  async createLog(data: {
    jobName: string;
    jobGroup: string;
    invokeTarget: string;
    status: string;
    jobMessage?: string;
    exceptionInfo?: string;
    startTime?: Date;
    endTime?: Date;
  }) {
    return this.prisma.sysJobLog.create({ data });
  }
}
