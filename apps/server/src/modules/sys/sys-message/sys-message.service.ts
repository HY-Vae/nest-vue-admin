import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SysMessageService {
  constructor(private readonly prisma: PrismaService) {}

  /* 获取消息汇总 */
  async getSummary(userId: string) {
    // 获取未读通知数量
    const notices = await this.prisma.sysNotice.findMany({
      where: { status: '0' },
      select: { id: true },
    });

    let noticeUnread = 0;
    if (notices.length > 0) {
      const noticeIds = notices.map((n) => n.id);
      const readNotices = await this.prisma.sysNoticeRead.findMany({
        where: { userId, noticeId: { in: noticeIds } },
        select: { noticeId: true },
      });
      const readNoticeIds = new Set(readNotices.map((r) => r.noticeId));
      noticeUnread = noticeIds.filter((id) => !readNoticeIds.has(id)).length;
    }

    // 获取待处理待办数量
    const todoPending = await this.prisma.sysTodo.count({
      where: { userId, status: 'pending' },
    });

    return {
      noticeUnread,
      todoPending,
    };
  }
}
