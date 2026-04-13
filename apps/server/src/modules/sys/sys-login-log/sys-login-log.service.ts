import { getIpLocation, getRequestIp } from '@/utils/util';
import type { ExportColumn } from '@/common/class/export.class';
import { ExcelExportService } from '@/common/class/export.class';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { PrismaService } from 'nestjs-prisma';
import { UAParser } from 'ua-parser-js';
import { GetSysLoginLogListDto } from './dto/req-sys-login-log.dto';

@Injectable()
export class SysLoginLogService {
  private readonly logger = new Logger(SysLoginLogService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly excelExportService: ExcelExportService,
  ) {}

  /* 记录登录成功日志 */
  async recordSuccess(request: Request, userId: string) {
    const { userName } = request.body as { userName?: string };
    const logData = this.parseRequest(request);

    return this.prisma.sysLoginLog
      .create({
        data: {
          userName: userName || 'unknown',
          userId,
          ...logData,
          status: '0',
        },
      })
      .catch((e) => {
        this.logger.error('记录登录成功日志失败:', e.message);
      });
  }

  /* 记录登录失败日志 */
  async recordFailure(request: Request, message: string) {
    const { userName } = request.body as { userName?: string };
    const logData = this.parseRequest(request);

    return this.prisma.sysLoginLog
      .create({
        data: {
          userName: userName || 'unknown',
          ...logData,
          status: '1',
          message,
        },
      })
      .catch((e) => {
        this.logger.error('记录登录失败日志失败:', e.message);
      });
  }

  /* 解析请求信息 */
  private parseRequest(request: Request) {
    const userAgent = request.headers['user-agent'] || '';
    const { browser, os } = this.parseUserAgent(userAgent);
    const ip = getRequestIp(request);
    const location = getIpLocation(ip);

    return {
      ip,
      browser,
      os,
      location,
    };
  }

  /* 解析 User-Agent */
  private parseUserAgent(userAgent: string): { browser: string; os: string } {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    return {
      browser: result.browser.name
        ? `${result.browser.name} ${result.browser.version || ''}`
        : '',
      os: result.os.name ? `${result.os.name} ${result.os.version || ''}` : '',
    };
  }

  /* 列表查询 */
  async findAll(query: GetSysLoginLogListDto) {
    const { skip, take } = query;
    const where: Prisma.SysLoginLogWhereInput = {};

    if (query.userName) {
      where.userName = { contains: query.userName };
    }
    if (query.ip) {
      where.ip = { contains: query.ip };
    }
    if (query.location) {
      where.location = { contains: query.location };
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
      this.prisma.sysLoginLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.sysLoginLog.count({ where }),
    ]);

    return { list, total };
  }

  /* 导出登录日志 */
  async exportExcel(
    fields: ExportColumn[],
    query: GetSysLoginLogListDto,
    res: Response,
  ) {
    const { skip, take, ...whereQuery } = query;
    const { list } = await this.findAll({ ...whereQuery } as GetSysLoginLogListDto);

    const buffer = await this.excelExportService.export({
      columns: fields,
      data: list as unknown as Record<string, unknown>[],
      filename: '登录日志',
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent('登录日志')}.xlsx"`,
    );
    res.send(buffer);
  }

  /* 通过id查询 */
  async findOne(id: number) {
    return this.prisma.sysLoginLog.findUnique({
      where: { id },
    });
  }

  /* 批量删除 */
  async removes(ids: number[]) {
    return this.prisma.sysLoginLog.deleteMany({
      where: { id: { in: ids } },
    });
  }

  /* 清空日志 */
  async clear() {
    return this.prisma.sysLoginLog.deleteMany();
  }
}
