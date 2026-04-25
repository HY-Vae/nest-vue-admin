import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { TempService } from './temp.service';

import { ApiException } from '@/common/exceptions/api.exception';
import { GenService } from '@/modules/tool/gen/gen.service';

/* Mock 类型定义 */
type MockMethod = jest.Mock;

interface MockTemp {
  findFirst: MockMethod;
  findMany: MockMethod;
  findUnique: MockMethod;
  create: MockMethod;
  update: MockMethod;
  delete: MockMethod;
  deleteMany: MockMethod;
  count: MockMethod;
}

interface MockSysMenu {
  count: MockMethod;
  create: MockMethod;
}

interface MockPrisma {
  temp: MockTemp;
  sysMenu: MockSysMenu;
  $transaction: MockMethod;
}

jest.mock('@/utils/util', () => ({
  generateUUid: jest.fn(() => 'mock-uuid-1234'),
}));

describe('TempService', () => {
  let service: TempService;
  let prisma: MockPrisma;

  const mockPrismaService: MockPrisma = {
    temp: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
    sysMenu: {
      count: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockGenService = {
    genTempModule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TempService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: GenService, useValue: mockGenService },
      ],
    }).compile();

    service = module.get<TempService>(TempService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ======================== findAll ======================== */
  describe('findAll', () => {
    it('应该根据筛选条件返回 { list, total }', async () => {
      const query = {
        name: '监控',
        code: 'monitor',
        skip: 0,
        take: 10,
      };

      const mockList = [
        { id: 'temp-1', name: '监控模块', code: 'monitor', tempPath: 'monitor' },
      ];
      const mockTotal = 1;

      prisma.temp.findMany.mockResolvedValue(mockList);
      prisma.temp.count.mockResolvedValue(mockTotal);

      const result = await service.findAll(query as any);

      const expectedWhere = {
        name: { contains: '监控' },
        code: 'monitor',
      };
      expect(prisma.temp.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: 0,
        take: 10,
      });
      expect(prisma.temp.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
      expect(result).toEqual({ list: mockList, total: mockTotal });
    });

    it('无筛选条件时 where 应为空对象', async () => {
      const query = { skip: 0, take: 10 };

      prisma.temp.findMany.mockResolvedValue([]);
      prisma.temp.count.mockResolvedValue(0);

      const result = await service.findAll(query as any);

      expect(prisma.temp.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({ list: [], total: 0 });
    });
  });

  /* ======================== findOptions ======================== */
  describe('findOptions', () => {
    it('应该返回所有模板选项', async () => {
      const mockTemps = [
        { id: 'temp-1', name: '监控模块', code: 'monitor' },
        { id: 'temp-2', name: '系统模块', code: 'system' },
      ];
      prisma.temp.findMany.mockResolvedValue(mockTemps);

      const result = await service.findOptions();

      expect(prisma.temp.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockTemps);
    });
  });

  /* ======================== findOne ======================== */
  describe('findOne', () => {
    it('应该返回模板详情', async () => {
      const mockTemp = {
        id: 'temp-1',
        name: '监控模块',
        code: 'monitor',
        tempPath: 'monitor',
      };
      prisma.temp.findUnique.mockResolvedValue(mockTemp as any);

      const result = await service.findOne('temp-1');

      expect(prisma.temp.findUnique).toHaveBeenCalledWith({
        where: { id: 'temp-1' },
      });
      expect(result).toEqual(mockTemp);
    });

    it('id 不存在时应该返回 null', async () => {
      prisma.temp.findUnique.mockResolvedValue(null);

      const result = await service.findOne('non-existent');

      expect(result).toBeNull();
    });
  });

  /* ======================== update ======================== */
  describe('update', () => {
    it('code 未重复时应该更新模板', async () => {
      const updateDto = { name: '监控模块V2', code: 'monitor', tempPath: 'monitor' };
      const updated = { id: 'temp-1', ...updateDto };

      prisma.temp.findFirst.mockResolvedValue(null);
      prisma.temp.update.mockResolvedValue(updated as any);

      const result = await service.update('temp-1', updateDto as any);

      expect(prisma.temp.findFirst).toHaveBeenCalledWith({
        where: { code: 'monitor', id: { not: 'temp-1' } },
      });
      expect(prisma.temp.update).toHaveBeenCalledWith({
        where: { id: 'temp-1' },
        data: { ...updateDto },
      });
      expect(result).toEqual(updated);
    });

    it('code 与其他记录重复时应该抛出 ApiException("模板code已存在")', async () => {
      const updateDto = { name: '模块', code: 'system', tempPath: 'system' };

      prisma.temp.findFirst.mockResolvedValue({
        id: 'temp-2',
        code: 'system',
      });

      await expect(
        service.update('temp-1', updateDto as any),
      ).rejects.toThrow(ApiException);
      await expect(
        service.update('temp-1', updateDto as any),
      ).rejects.toThrow('模板code已存在');
      expect(prisma.temp.update).not.toHaveBeenCalled();
    });
  });

  /* ======================== remove ======================== */
  describe('remove', () => {
    it('模板存在时应该删除模板', async () => {
      prisma.temp.findUnique.mockResolvedValue({
        id: 'temp-1',
        name: '监控模块',
        code: 'monitor',
      });
      prisma.temp.delete.mockResolvedValue({ id: 'temp-1' } as any);

      await service.remove('temp-1');

      expect(prisma.temp.findUnique).toHaveBeenCalledWith({
        where: { id: 'temp-1' },
      });
      expect(prisma.temp.delete).toHaveBeenCalledWith({
        where: { id: 'temp-1' },
      });
    });

    it('模板不存在时应该抛出 ApiException("数据不存在，删除失败！")', async () => {
      prisma.temp.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        ApiException,
      );
      await expect(service.remove('non-existent')).rejects.toThrow(
        '数据不存在，删除失败！',
      );
      expect(prisma.temp.delete).not.toHaveBeenCalled();
    });
  });

  /* ======================== removes ======================== */
  describe('removes', () => {
    it('应该批量删除模板', async () => {
      prisma.temp.deleteMany.mockResolvedValue({ count: 2 });

      await service.removes(['temp-1', 'temp-2']);

      expect(prisma.temp.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: ['temp-1', 'temp-2'] } },
      });
    });

    it('传入空数组时应该调用 deleteMany 传入空 in 条件', async () => {
      prisma.temp.deleteMany.mockResolvedValue({ count: 0 });

      await service.removes([]);

      expect(prisma.temp.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: [] } },
      });
    });
  });
});
