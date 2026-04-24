import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { SysDictDetailService } from './sys-dict-detail.service';

import { ApiException } from '@/common/exceptions/api.exception';

jest.mock('@/utils/util', () => ({
  generateRedisKey: jest.fn((...args: string[]) => args.join(':')),
}));

/* Mock 类型定义 */
type MockMethod = jest.Mock;

interface MockSysDictDetail {
  findFirst: MockMethod;
  findMany: MockMethod;
  findUnique: MockMethod;
  create: MockMethod;
  update: MockMethod;
  delete: MockMethod;
  deleteMany: MockMethod;
  count: MockMethod;
}

interface MockPrisma {
  sysDictDetail: MockSysDictDetail;
}

describe('SysDictDetailService', () => {
  let service: SysDictDetailService;
  let prisma: MockPrisma;
  let cacheManager: { get: MockMethod; set: MockMethod; del: MockMethod };

  const mockPrismaService: MockPrisma = {
    sysDictDetail: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SysDictDetailService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<SysDictDetailService>(SysDictDetailService);
    prisma = module.get(PrismaService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ======================== create ======================== */
  describe('create', () => {
    it('value 不存在时应该正常创建字典详情', async () => {
      const createDto = {
        sysDictCode: 'gender',
        label: '男',
        value: '1',
        sort: 1,
        status: '0',
      };
      const created = { id: 1, ...createDto };

      prisma.sysDictDetail.findFirst.mockResolvedValue(null);
      prisma.sysDictDetail.create.mockResolvedValue(created);

      const result = await service.create(createDto as any);

      expect(prisma.sysDictDetail.findFirst).toHaveBeenCalledWith({
        where: { value: '1', sysDictCode: 'gender' },
      });
      expect(prisma.sysDictDetail.create).toHaveBeenCalledWith({
        data: { ...createDto },
      });
      expect(result).toEqual(created);
    });

    it('创建成功后应该清除缓存', async () => {
      const createDto = {
        sysDictCode: 'gender',
        label: '男',
        value: '1',
        sort: 1,
        status: '0',
      };
      const created = { id: 1, ...createDto };

      prisma.sysDictDetail.findFirst.mockResolvedValue(null);
      prisma.sysDictDetail.create.mockResolvedValue(created);

      await service.create(createDto as any);

      expect(cacheManager.del).toHaveBeenCalledWith('dict:key:gender');
    });

    it('value 已存在时应该抛出 ApiException("字典值已存在")', async () => {
      const createDto = {
        sysDictCode: 'gender',
        label: '男',
        value: '1',
        sort: 1,
        status: '0',
      };

      prisma.sysDictDetail.findFirst.mockResolvedValue({
        id: 1,
        value: '1',
        sysDictCode: 'gender',
      });

      await expect(service.create(createDto as any)).rejects.toThrow(
        ApiException,
      );
      await expect(service.create(createDto as any)).rejects.toThrow(
        '字典值已存在',
      );
      expect(prisma.sysDictDetail.create).not.toHaveBeenCalled();
    });
  });

  /* ======================== findAll ======================== */
  describe('findAll', () => {
    it('应该根据筛选条件返回 { list, total }', async () => {
      const query = {
        sysDictCode: 'gender',
        label: '男',
        value: '1',
        status: '0',
        skip: 0,
        take: 10,
      };

      const mockList = [
        { id: 1, label: '男', value: '1', sysDictCode: 'gender', status: '0' },
      ];
      const mockTotal = 1;

      prisma.sysDictDetail.findMany.mockResolvedValue(mockList);
      prisma.sysDictDetail.count.mockResolvedValue(mockTotal);

      const result = await service.findAll(query as any);

      const expectedWhere = {
        sysDictCode: 'gender',
        label: { contains: '男' },
        value: { contains: '1' },
        status: '0',
      };
      expect(prisma.sysDictDetail.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: 0,
        take: 10,
      });
      expect(prisma.sysDictDetail.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
      expect(result).toEqual({ list: mockList, total: mockTotal });
    });

    it('只有 sysDictCode 时 where 应只包含 sysDictCode', async () => {
      const query = { sysDictCode: 'gender', skip: 0, take: 10 };

      prisma.sysDictDetail.findMany.mockResolvedValue([]);
      prisma.sysDictDetail.count.mockResolvedValue(0);

      const result = await service.findAll(query as any);

      expect(prisma.sysDictDetail.findMany).toHaveBeenCalledWith({
        where: { sysDictCode: 'gender' },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({ list: [], total: 0 });
    });
  });

  /* ======================== findOne ======================== */
  describe('findOne', () => {
    it('应该返回字典详情', async () => {
      const mockDetail = {
        id: 1,
        label: '男',
        value: '1',
        sysDictCode: 'gender',
      };
      prisma.sysDictDetail.findUnique.mockResolvedValue(mockDetail as any);

      const result = await service.findOne(1);

      expect(prisma.sysDictDetail.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockDetail);
    });

    it('id 不存在时应该返回 null', async () => {
      prisma.sysDictDetail.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  /* ======================== update ======================== */
  describe('update', () => {
    it('value 未重复时应该更新字典详情并清除缓存', async () => {
      const updateDto = {
        sysDictCode: 'gender',
        label: '男V2',
        value: '1',
        sort: 2,
        status: '0',
      };
      const updated = { id: 1, ...updateDto };

      prisma.sysDictDetail.findFirst.mockResolvedValue(null);
      prisma.sysDictDetail.update.mockResolvedValue(updated);

      const result = await service.update(1, updateDto as any);

      expect(prisma.sysDictDetail.findFirst).toHaveBeenCalledWith({
        where: { value: '1', sysDictCode: 'gender', id: { not: 1 } },
      });
      expect(prisma.sysDictDetail.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...updateDto },
      });
      expect(cacheManager.del).toHaveBeenCalledWith('dict:key:gender');
      expect(result).toEqual(updated);
    });

    it('value 与其他记录重复时应该抛出 ApiException("字典值已存在")', async () => {
      const updateDto = {
        sysDictCode: 'gender',
        label: '女',
        value: '2',
        sort: 1,
        status: '0',
      };

      prisma.sysDictDetail.findFirst.mockResolvedValue({
        id: 2,
        value: '2',
        sysDictCode: 'gender',
      });

      await expect(service.update(1, updateDto as any)).rejects.toThrow(
        ApiException,
      );
      await expect(service.update(1, updateDto as any)).rejects.toThrow(
        '字典值已存在',
      );
      expect(prisma.sysDictDetail.update).not.toHaveBeenCalled();
      expect(cacheManager.del).not.toHaveBeenCalled();
    });
  });

  /* ======================== remove ======================== */
  describe('remove', () => {
    it('应该删除字典详情并清除缓存', async () => {
      prisma.sysDictDetail.delete.mockResolvedValue({ id: 1 });

      await service.remove(1, { sysDictCode: 'gender' } as any);

      expect(prisma.sysDictDetail.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(cacheManager.del).toHaveBeenCalledWith('dict:key:gender');
    });
  });

  /* ======================== removes ======================== */
  describe('removes', () => {
    it('应该批量删除字典详情并清除缓存', async () => {
      const body = { ids: [1, 2, 3], sysDictCode: 'gender' };

      prisma.sysDictDetail.deleteMany.mockResolvedValue({ count: 3 });

      await service.removes(body as any);

      expect(prisma.sysDictDetail.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: [1, 2, 3] },
          sysDictCode: 'gender',
        },
      });
      expect(cacheManager.del).toHaveBeenCalledWith('dict:key:gender');
    });

    it('ids 为空数组时应该抛出 ApiException("参数异常")', async () => {
      const body = { ids: [], sysDictCode: 'gender' };

      await expect(service.removes(body as any)).rejects.toThrow(ApiException);
      await expect(service.removes(body as any)).rejects.toThrow('参数异常');
      expect(prisma.sysDictDetail.deleteMany).not.toHaveBeenCalled();
    });

    it('ids 为 undefined 时应该抛出 ApiException("参数异常")', async () => {
      const body = { ids: undefined, sysDictCode: 'gender' };

      await expect(service.removes(body as any)).rejects.toThrow(ApiException);
      await expect(service.removes(body as any)).rejects.toThrow('参数异常');
      expect(prisma.sysDictDetail.deleteMany).not.toHaveBeenCalled();
    });
  });

  /* ======================== removeCache ======================== */
  describe('removeCache', () => {
    it('应该删除指定 code 对应的缓存', async () => {
      await service.removeCache('gender');

      expect(cacheManager.del).toHaveBeenCalledWith('dict:key:gender');
    });
  });
});
