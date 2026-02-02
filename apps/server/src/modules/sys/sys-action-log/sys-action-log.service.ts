import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { GetSysActionLogListDto } from './dto/req-sysActionLog.dto';

@Injectable()
export class SysActionLogService {
  constructor(private readonly prisma: PrismaService) {}

  /* 列表查询 */
  async findAll(query: GetSysActionLogListDto) {
    const { skip, take } = query;
    const where: Prisma.SysActionLogWhereInput = {};

    if (query.title != undefined) {
      where.title = { contains: query.title };
    }
    if (query.action != undefined) {
      where.action = query.action;
    }

    if (query.ip != undefined) {
      where.ip = { contains: query.ip };
    }
    if (query.address != undefined) {
      where.address = { contains: query.address };
    }

    if (query.userName != undefined) {
      where.userName = { contains: query.userName };
    }

    if (query.status != undefined) {
      where.status = query.status;
    }

    const listPromise = this.prisma.sysActionLog.findMany({
      where,
      skip,
      take,
      orderBy: {
        createTime: 'desc',
      },
    });
    const totalPromise = this.prisma.sysActionLog.count({
      where,
    });
    const [list, total] = await Promise.all([listPromise, totalPromise]);
    return {
      list,
      total,
    };
  }

  /* 通过id查询 */
  async findOne(id: number) {
    return this.prisma.sysActionLog.findUnique({
      where: {
        id,
      },
    });
  }
}
