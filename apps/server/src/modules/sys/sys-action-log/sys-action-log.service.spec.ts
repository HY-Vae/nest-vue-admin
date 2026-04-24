import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { SysActionLogService } from './sys-action-log.service';

/* Mock 类型定义 */
type MockMethod = jest.Mock;

interface MockSysActionLog {
  findMany: MockMethod;
  findUnique: MockMethod;
  count: MockMethod;
}

interface MockPrisma {
  sysActionLog: MockSysActionLog;
}

describe('SysActionLogService', () => {
  let service: SysActionLogService;
  let prisma: MockPrisma;

  const mockPrismaService: MockPrisma = {
    sysActionLog: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SysActionLogService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SysActionLogService>(SysActionLogService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ======================== findAll ======================== */
  describe('findAll', () => {
    it('应该根据筛选条件返回 { list, total }', async () => {
      const query = {
        title: '登录',
        action: 'login',
        ip: '127.0.0.1',
        address: '本地',
        userName: 'admin',
        status: '0',
        skip: 0,
        take: 10,
      };

      const mockList = [
        {
          id: 1,
          title: '用户登录',
          action: 'login',
          ip: '127.0.0.1',
          userName: 'admin',
          status: '0',
        },
      ];
      const mockTotal = 1;

      prisma.sysActionLog.findMany.mockResolvedValue(mockList);
      prisma.sysActionLog.count.mockResolvedValue(mockTotal);

      const result = await service.findAll(query as any);

      const expectedWhere = {
        title: { contains: '登录' },
        action: 'login',
        ip: { contains: '127.0.0.1' },
        address: { contains: '本地' },
        userName: { contains: 'admin' },
        status: '0',
      };
      expect(prisma.sysActionLog.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.sysActionLog.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
      expect(result).toEqual({ list: mockList, total: mockTotal });
    });

    it('无筛选条件时 where 应为空对象', async () => {
      const query = { skip: 0, take: 10 };

      prisma.sysActionLog.findMany.mockResolvedValue([]);
      prisma.sysActionLog.count.mockResolvedValue(0);

      const result = await service.findAll(query as any);

      expect(prisma.sysActionLog.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual({ list: [], total: 0 });
    });

    it('应该支持按标题模糊查询', async () => {
      prisma.sysActionLog.findMany.mockResolvedValue([]);
      prisma.sysActionLog.count.mockResolvedValue(0);

      await service.findAll({ skip: 0, take: 10, title: '删除' } as any);

      const whereArg = prisma.sysActionLog.findMany.mock.calls[0][0].where;
      expect(whereArg.title).toEqual({ contains: '删除' });
    });

    it('应该支持按用户名模糊查询', async () => {
      prisma.sysActionLog.findMany.mockResolvedValue([]);
      prisma.sysActionLog.count.mockResolvedValue(0);

      await service.findAll({ skip: 0, take: 10, userName: 'test' } as any);

      const whereArg = prisma.sysActionLog.findMany.mock.calls[0][0].where;
      expect(whereArg.userName).toEqual({ contains: 'test' });
    });

    it('应该按创建时间倒序排列', async () => {
      prisma.sysActionLog.findMany.mockResolvedValue([]);
      prisma.sysActionLog.count.mockResolvedValue(0);

      await service.findAll({ skip: 0, take: 10 } as any);

      const orderBy = prisma.sysActionLog.findMany.mock.calls[0][0].orderBy;
      expect(orderBy).toEqual({ createdAt: 'desc' });
    });
  });

  /* ======================== findOne ======================== */
  describe('findOne', () => {
    it('应该返回操作日志详情', async () => {
      const mockLog = {
        id: 1,
        title: '用户登录',
        action: 'login',
        ip: '127.0.0.1',
        userName: 'admin',
        status: '0',
      };
      prisma.sysActionLog.findUnique.mockResolvedValue(mockLog as any);

      const result = await service.findOne(1);

      expect(prisma.sysActionLog.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockLog);
    });

    it('id 不存在时应该返回 null', async () => {
      prisma.sysActionLog.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });
});
