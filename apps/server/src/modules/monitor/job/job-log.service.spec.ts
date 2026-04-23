import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { JobLogService } from './job-log.service';

describe('JobLogService', () => {
  let service: JobLogService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      sysJobLog: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobLogService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<JobLogService>(JobLogService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll - 分页查询任务日志', () => {
    it('应返回分页列表', async () => {
      const mockList = [
        { id: 1, jobName: '测试任务', status: '0', createdAt: new Date() },
      ];
      prismaMock.sysJobLog.findMany.mockResolvedValue(mockList);
      prismaMock.sysJobLog.count.mockResolvedValue(1);

      const result = await service.findAll({
        current: 1,
        pageSize: 20,
        skip: 0,
        take: 20,
      } as any);

      expect(result).toEqual({ list: mockList, total: 1 });
      expect(prismaMock.sysJobLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
          skip: 0,
          take: 20,
          orderBy: { createdAt: 'desc' },
        }),
      );
    });

    it('应支持按任务名称和状态筛选', async () => {
      prismaMock.sysJobLog.findMany.mockResolvedValue([]);
      prismaMock.sysJobLog.count.mockResolvedValue(0);

      await service.findAll({
        current: 1,
        pageSize: 20,
        skip: 0,
        take: 20,
        jobName: '清理',
        status: '1',
      } as any);

      const whereArg = prismaMock.sysJobLog.findMany.mock.calls[0][0].where;
      expect(whereArg.jobName).toEqual({ contains: '清理' });
      expect(whereArg.status).toBe('1');
    });

    it('应支持按时间范围筛选', async () => {
      prismaMock.sysJobLog.findMany.mockResolvedValue([]);
      prismaMock.sysJobLog.count.mockResolvedValue(0);

      await service.findAll({
        current: 1,
        pageSize: 20,
        skip: 0,
        take: 20,
        startTime: '2026-01-01',
        endTime: '2026-12-31',
      } as any);

      const whereArg = prismaMock.sysJobLog.findMany.mock.calls[0][0].where;
      expect(whereArg.createdAt.gte).toBeInstanceOf(Date);
      expect(whereArg.createdAt.lte).toBeInstanceOf(Date);
    });
  });

  describe('findOne - 查询日志详情', () => {
    it('应返回指定ID的日志', async () => {
      const mockLog = { id: 1, jobName: '测试任务' };
      prismaMock.sysJobLog.findUnique.mockResolvedValue(mockLog);

      const result = await service.findOne(1);
      expect(result).toEqual(mockLog);
      expect(prismaMock.sysJobLog.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('removes - 批量删除日志', () => {
    it('应删除指定ID的日志', async () => {
      prismaMock.sysJobLog.deleteMany.mockResolvedValue({ count: 3 });

      await service.removes([1, 2, 3]);
      expect(prismaMock.sysJobLog.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2, 3] } },
      });
    });
  });

  describe('clean - 清空日志', () => {
    it('应删除所有日志', async () => {
      prismaMock.sysJobLog.deleteMany.mockResolvedValue({ count: 10 });

      await service.clean();
      expect(prismaMock.sysJobLog.deleteMany).toHaveBeenCalled();
    });
  });

  describe('createLog - 内部创建日志', () => {
    it('应创建日志记录', async () => {
      const mockLog = { id: 1, jobName: 'test' };
      prismaMock.sysJobLog.create.mockResolvedValue(mockLog);

      const result = await service.createLog({
        jobName: 'test',
        jobGroup: 'default',
        invokeTarget: 'testService.run()',
        status: '0',
        jobMessage: '执行成功',
        startTime: new Date(),
        endTime: new Date(),
      });

      expect(result).toEqual(mockLog);
      expect(prismaMock.sysJobLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          jobName: 'test',
          status: '0',
        }),
      });
    });
  });
});
