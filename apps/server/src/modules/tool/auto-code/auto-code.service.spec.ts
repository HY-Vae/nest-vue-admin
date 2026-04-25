import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { AutoCodeService } from './auto-code.service';

/* Mock 深层依赖（prettier ESM 兼容问题） */
jest.mock('@/modules/tool/auto-code/utils/generate', () => ({
  checkAllRules: jest.fn(),
  createGenerateConfig: jest.fn(),
  createWebTemp: jest.fn(),
  generateServerFiles: jest.fn(),
  runProjectFormat: jest.fn(),
}));
jest.mock('@/modules/tool/auto-code/utils/auth', () => ({
  createBtnAuthMap: jest.fn(),
  createBtnAuths: jest.fn(),
  createMenuBody: jest.fn(),
}));
jest.mock('@/modules/tool/auto-code/utils/model', () => ({
  createPrismaModel: jest.fn(),
}));

/* Mock 类型定义 */
type MockMethod = jest.Mock;

interface MockAutoCode {
  findMany: MockMethod;
  findUnique: MockMethod;
  create: MockMethod;
  delete: MockMethod;
  deleteMany: MockMethod;
  count: MockMethod;
}

interface MockPrisma {
  autoCode: MockAutoCode;
}

describe('AutoCodeService', () => {
  let service: AutoCodeService;
  let prisma: MockPrisma;

  const mockPrismaService: MockPrisma = {
    autoCode: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutoCodeService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AutoCodeService>(AutoCodeService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ======================== findAll ======================== */
  describe('findAll', () => {
    it('应该根据筛选条件返回 { list, total }', async () => {
      const query = {
        name: 'user',
        nameZh: '用户',
        tempId: 'temp-1',
        skip: 0,
        take: 10,
      };

      const mockList = [
        { id: 1, name: 'user', nameZh: '用户', tempId: 'temp-1' },
      ];
      const mockTotal = 1;

      prisma.autoCode.findMany.mockResolvedValue(mockList);
      prisma.autoCode.count.mockResolvedValue(mockTotal);

      const result = await service.findAll(query as any);

      const expectedWhere = {
        name: 'user',
        nameZh: '用户',
        tempId: 'temp-1',
      };
      expect(prisma.autoCode.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: 0,
        take: 10,
      });
      expect(prisma.autoCode.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
      expect(result).toEqual({ list: mockList, total: mockTotal });
    });

    it('无筛选条件时 where 应为空对象', async () => {
      const query = { skip: 0, take: 10 };

      prisma.autoCode.findMany.mockResolvedValue([]);
      prisma.autoCode.count.mockResolvedValue(0);

      const result = await service.findAll(query as any);

      expect(prisma.autoCode.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({ list: [], total: 0 });
    });
  });

  /* ======================== findOne ======================== */
  describe('findOne', () => {
    it('应该返回代码生成记录详情', async () => {
      const mockRecord = {
        id: 1,
        name: 'user',
        nameZh: '用户',
        tempId: 'temp-1',
        fields: '[]',
      };
      prisma.autoCode.findUnique.mockResolvedValue(mockRecord as any);

      const result = await service.findOne(1);

      expect(prisma.autoCode.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockRecord);
    });

    it('id 不存在时应该返回 null', async () => {
      prisma.autoCode.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  /* ======================== remove ======================== */
  describe('remove', () => {
    it('应该成功删除代码生成记录', async () => {
      const deleted = { id: 1, name: 'user', nameZh: '用户' };
      prisma.autoCode.delete.mockResolvedValue(deleted as any);

      const result = await service.remove(1);

      expect(prisma.autoCode.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(deleted);
    });
  });

  /* ======================== removes ======================== */
  describe('removes', () => {
    it('应该批量删除代码生成记录', async () => {
      prisma.autoCode.deleteMany.mockResolvedValue({ count: 3 });

      await service.removes([1, 2, 3]);

      expect(prisma.autoCode.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2, 3] } },
      });
    });

    it('传入空数组时应该调用 deleteMany 传入空 in 条件', async () => {
      prisma.autoCode.deleteMany.mockResolvedValue({ count: 0 });

      await service.removes([]);

      expect(prisma.autoCode.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: [] } },
      });
    });
  });
});
