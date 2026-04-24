import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;
  let prismaMock: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prismaMock = {
      $queryRaw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ======================== checkDatabase ======================== */
  describe('checkDatabase', () => {
    it('数据库连接正常时应该返回 status: up', async () => {
      prismaMock.$queryRaw.mockResolvedValue([{ '1': 1 }]);

      const result = await service.checkDatabase();

      expect(result).toEqual({
        status: 'up',
        info: { database: { status: 'up' } },
      });
    });

    it('数据库连接异常时应该返回 status: down', async () => {
      prismaMock.$queryRaw.mockRejectedValue(new Error('Connection refused'));

      const result = await service.checkDatabase();

      expect(result).toEqual({
        status: 'down',
        info: { database: { status: 'down' } },
      });
    });
  });

  /* ======================== checkMemory ======================== */
  describe('checkMemory', () => {
    it('应该返回内存使用信息', async () => {
      const result = await service.checkMemory();

      expect(result.status).toBe('up');
      expect(result.info.memory.status).toBe('up');
      expect(result.info.memory.rss).toMatch(/^\d+\.\d+ MB$/);
      expect(result.info.memory.heapUsed).toMatch(/^\d+\.\d+ MB$/);
      expect(result.info.memory.heapTotal).toMatch(/^\d+\.\d+ MB$/);
    });
  });

  /* ======================== check ======================== */
  describe('check', () => {
    it('数据库和内存都正常时应该返回 status: ok', async () => {
      prismaMock.$queryRaw.mockResolvedValue([{ '1': 1 }]);

      const result = await service.check();

      expect(result.status).toBe('ok');
      expect(result.info.database.status).toBe('up');
      expect(result.info.memory.status).toBe('up');
    });

    it('数据库异常时应该返回 status: error', async () => {
      prismaMock.$queryRaw.mockRejectedValue(new Error('Connection refused'));

      const result = await service.check();

      expect(result.status).toBe('error');
      expect(result.info.database.status).toBe('down');
      expect(result.info.memory.status).toBe('up');
    });
  });
});
