import { Test, TestingModule } from '@nestjs/testing';
import { SysDeptService } from './sys-dept.service';
import { PrismaService } from 'nestjs-prisma';
import { ApiException } from '@/common/exceptions/api.exception';

describe('SysDeptService', () => {
  let service: SysDeptService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    sysDept: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
    sysUser: {
      groupBy: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SysDeptService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SysDeptService>(SysDeptService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('应该成功创建根部门（无父级）', async () => {
      const createDto = {
        deptName: '总公司',
        deptCode: 'HQ',
        status: '1',
        sort: 0,
      };

      prisma.sysDept.create.mockResolvedValue({
        id: 'dept-1',
        ...createDto,
        parentId: null,
        remark: null,
        createBy: null,
        createdAt: new Date(),
        updateBy: null,
        updatedAt: new Date(),
      } as any);

      const result = await service.create(createDto as any);

      expect(prisma.sysDept.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          deptName: '总公司',
          deptCode: 'HQ',
          parentId: null,
        }),
      });
      expect(result.deptName).toBe('总公司');
    });

    it('应该成功创建子部门（有父级）', async () => {
      const createDto = {
        deptName: '技术部',
        deptCode: 'TECH',
        status: '1',
        parentId: 'dept-1',
        sort: 1,
      };

      prisma.sysDept.findUnique.mockResolvedValue({
        id: 'dept-1',
        deptName: '总公司',
      } as any);

      prisma.sysDept.create.mockResolvedValue({
        id: 'dept-2',
        ...createDto,
        remark: null,
        createBy: null,
        createdAt: new Date(),
        updateBy: null,
        updatedAt: new Date(),
      } as any);

      const result = await service.create(createDto as any);

      expect(prisma.sysDept.findUnique).toHaveBeenCalledWith({
        where: { id: 'dept-1' },
      });
      expect(result.deptName).toBe('技术部');
    });

    it('父级不存在时应该抛出异常', async () => {
      const createDto = {
        deptName: '技术部',
        deptCode: 'TECH',
        status: '1',
        parentId: 'non-existent',
      };

      prisma.sysDept.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto as any)).rejects.toThrow(ApiException);
      await expect(service.create(createDto as any)).rejects.toThrow('父级部门不存在');
    });
  });

  describe('findAll (树形结构)', () => {
    it('应该返回树形结构的部门列表', async () => {
      const mockDepts = [
        { id: 'dept-1', deptName: '总公司', deptCode: 'HQ', parentId: null, sort: 0, status: '1', remark: null, createBy: null, createdAt: new Date(), updateBy: null, updatedAt: new Date() },
        { id: 'dept-2', deptName: '技术部', deptCode: 'TECH', parentId: 'dept-1', sort: 1, status: '1', remark: null, createBy: null, createdAt: new Date(), updateBy: null, updatedAt: new Date() },
        { id: 'dept-3', deptName: '产品部', deptCode: 'PRODUCT', parentId: 'dept-1', sort: 2, status: '1', remark: null, createBy: null, createdAt: new Date(), updateBy: null, updatedAt: new Date() },
      ];

      prisma.sysDept.findMany.mockResolvedValue(mockDepts as any);
      prisma.sysUser.groupBy.mockResolvedValue([
        { deptId: 'dept-1', _count: { id: 5 } },
        { deptId: 'dept-2', _count: { id: 3 } },
      ] as any);
      // Mock for leaders query
      prisma.sysUser.findMany.mockResolvedValue([]);

      const result = await service.findAll({} as any);

      expect(result.list).toBeDefined();
      // 树形结构：根节点应该有 children
      const rootDept = result.list.find((d: any) => d.id === 'dept-1');
      expect(rootDept?.children).toHaveLength(2);
    });
  });

  describe('remove', () => {
    it('有子部门时应该禁止删除', async () => {
      prisma.sysDept.count.mockResolvedValue(2); // 有 2 个子部门

      await expect(service.remove('dept-1')).rejects.toThrow('该部门下存在子部门，无法删除');
    });

    it('部门下有用户时应该禁止删除', async () => {
      prisma.sysDept.count.mockResolvedValueOnce(0); // 无子部门
      prisma.sysUser.count.mockResolvedValueOnce(3); // 有 3 个用户

      await expect(service.remove('dept-1')).rejects.toThrow('该部门下存在用户，无法删除');
    });

    it('无子部门且无用户时应该成功删除', async () => {
      prisma.sysDept.count.mockResolvedValueOnce(0); // 无子部门
      prisma.sysUser.count.mockResolvedValueOnce(0); // 无用户
      prisma.sysDept.delete.mockResolvedValue({
        id: 'dept-1',
        deptName: '总公司',
      } as any);

      const result = await service.remove('dept-1');

      expect(prisma.sysDept.delete).toHaveBeenCalledWith({
        where: { id: 'dept-1' },
      });
      expect(result.id).toBe('dept-1');
    });
  });

  describe('update', () => {
    it('更新时不能将父级设为自己', async () => {
      const updateDto = {
        deptName: '总公司',
        deptCode: 'HQ',
        parentId: 'dept-1', // 父级设为自己
      };

      prisma.sysDept.findUnique.mockResolvedValue({
        id: 'dept-1',
        deptName: '总公司',
      } as any);

      await expect(service.update('dept-1', updateDto as any)).rejects.toThrow(ApiException);
      await expect(service.update('dept-1', updateDto as any)).rejects.toThrow('父级部门不能是自己');
    });
  });
});
