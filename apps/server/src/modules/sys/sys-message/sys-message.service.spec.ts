import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { SysMessageService } from './sys-message.service';

/* Mock 类型定义 */
type MockMethod = jest.Mock;

interface MockSysNotice {
  findMany: MockMethod;
}

interface MockSysNoticeRead {
  findMany: MockMethod;
}

interface MockSysTodo {
  count: MockMethod;
}

interface MockPrisma {
  sysNotice: MockSysNotice;
  sysNoticeRead: MockSysNoticeRead;
  sysTodo: MockSysTodo;
}

describe('SysMessageService', () => {
  let service: SysMessageService;
  let prisma: MockPrisma;

  const mockPrismaService: MockPrisma = {
    sysNotice: {
      findMany: jest.fn(),
    },
    sysNoticeRead: {
      findMany: jest.fn(),
    },
    sysTodo: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SysMessageService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SysMessageService>(SysMessageService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSummary', () => {
    it('应该正确返回消息汇总（有未读通知和待处理待办）', async () => {
      const userId = 'user-1';

      // Mock 通知列表
      mockPrismaService.sysNotice.findMany.mockResolvedValue([
        { id: 'notice-1' },
        { id: 'notice-2' },
        { id: 'notice-3' },
      ]);

      // Mock 已读通知（notice-1 已读）
      mockPrismaService.sysNoticeRead.findMany.mockResolvedValue([
        { noticeId: 'notice-1' },
      ]);

      // Mock 待处理待办数量
      mockPrismaService.sysTodo.count.mockResolvedValue(5);

      const result = await service.getSummary(userId);

      expect(result).toEqual({
        noticeUnread: 2, // 3条通知，1条已读
        todoPending: 5,
      });
    });

    it('应该正确返回消息汇总（无通知）', async () => {
      const userId = 'user-1';

      mockPrismaService.sysNotice.findMany.mockResolvedValue([]);
      mockPrismaService.sysTodo.count.mockResolvedValue(0);

      const result = await service.getSummary(userId);

      expect(result).toEqual({
        noticeUnread: 0,
        todoPending: 0,
      });

      // 无通知时不应查询已读记录
      expect(mockPrismaService.sysNoticeRead.findMany).not.toHaveBeenCalled();
    });

    it('应该正确返回消息汇总（所有通知都已读）', async () => {
      const userId = 'user-1';

      mockPrismaService.sysNotice.findMany.mockResolvedValue([
        { id: 'notice-1' },
        { id: 'notice-2' },
      ]);

      mockPrismaService.sysNoticeRead.findMany.mockResolvedValue([
        { noticeId: 'notice-1' },
        { noticeId: 'notice-2' },
      ]);

      mockPrismaService.sysTodo.count.mockResolvedValue(3);

      const result = await service.getSummary(userId);

      expect(result).toEqual({
        noticeUnread: 0,
        todoPending: 3,
      });
    });

    it('应该只查询正常状态的通知', async () => {
      const userId = 'user-1';

      mockPrismaService.sysNotice.findMany.mockResolvedValue([]);
      mockPrismaService.sysTodo.count.mockResolvedValue(0);

      await service.getSummary(userId);

      expect(mockPrismaService.sysNotice.findMany).toHaveBeenCalledWith({
        where: { status: '0' },
        select: { id: true },
      });
    });

    it('应该只查询当前用户的待处理待办', async () => {
      const userId = 'user-1';

      mockPrismaService.sysNotice.findMany.mockResolvedValue([]);
      mockPrismaService.sysTodo.count.mockResolvedValue(0);

      await service.getSummary(userId);

      expect(mockPrismaService.sysTodo.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', status: 'pending' },
      });
    });
  });
});
