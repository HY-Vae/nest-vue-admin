import { ApiException } from '@/common/exceptions/api.exception';
import { ExcelExportService } from '@/common/class/export.class';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { SysPostService } from './sys-post.service';
import type {
  CreateSysPostDto,
  UpdateSysPostDto,
} from './dto/req-sys-post.dto';

/* Mock 类型定义 */
type MockMethod = jest.Mock;

interface MockSysPost {
  create: MockMethod;
  findUnique: MockMethod;
  findFirst: MockMethod;
  findMany: MockMethod;
  update: MockMethod;
  delete: MockMethod;
  deleteMany: MockMethod;
  count: MockMethod;
}

interface MockSysDept {
  findUnique: MockMethod;
  findMany: MockMethod;
}

interface MockSysUser {
  groupBy: MockMethod;
  count: MockMethod;
  findMany: MockMethod;
}

interface MockPrisma {
  sysPost: MockSysPost;
  sysDept: MockSysDept;
  sysUser: MockSysUser;
}

describe('SysPostService', () => {
  let service: SysPostService;
  let prisma: MockPrisma;

  const mockPrismaService: MockPrisma = {
    sysPost: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
    sysDept: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    sysUser: {
      groupBy: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockCacheManager = {
    del: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockExcelExportService = {
    export: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SysPostService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: ExcelExportService,
          useValue: mockExcelExportService,
        },
      ],
    }).compile();

    service = module.get<SysPostService>(SysPostService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('带 roleIds 时应该调用 roles.connect', async () => {
      const createDto: CreateSysPostDto = {
        name: '技术总监',
        code: 'tech_director',
        status: '0',
        roleIds: ['role-1', 'role-2'],
      } as any;

      mockPrismaService.sysPost.findUnique.mockResolvedValue(null);
      mockPrismaService.sysPost.create.mockResolvedValue({
        id: 'post-1',
        ...createDto,
      });

      await service.create(createDto);

      expect(mockPrismaService.sysPost.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            roles: {
              connect: [{ id: 'role-1' }, { id: 'role-2' }],
            },
          }),
        }),
      );
    });

    it('不带 roleIds 时应该正常创建（不传 roles）', async () => {
      const createDto: CreateSysPostDto = {
        name: '技术总监',
        code: 'tech_director',
        status: '0',
      } as any;

      mockPrismaService.sysPost.findUnique.mockResolvedValue(null);
      mockPrismaService.sysPost.create.mockResolvedValue({
        id: 'post-1',
        ...createDto,
      });

      await service.create(createDto);

      const createCall = mockPrismaService.sysPost.create.mock.calls[0][0];
      expect(createCall.data).not.toHaveProperty('roles');
    });
  });

  describe('update', () => {
    it('带 roleIds 时应该调用 roles.set 并清除用户缓存', async () => {
      const updateDto: UpdateSysPostDto = {
        name: '技术总监V2',
        roleIds: ['role-1', 'role-3'],
      } as any;

      mockPrismaService.sysPost.findFirst.mockResolvedValue(null);
      mockPrismaService.sysPost.update.mockResolvedValue({
        id: 'post-1',
        ...updateDto,
      });
      mockPrismaService.sysUser.findMany.mockResolvedValue([
        { id: 'user-1' },
        { id: 'user-2' },
      ]);

      await service.update('post-1', updateDto);

      expect(mockPrismaService.sysPost.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'post-1' },
          data: expect.objectContaining({
            roles: {
              set: [{ id: 'role-1' }, { id: 'role-3' }],
            },
          }),
        }),
      );

      // 验证缓存被清除
      expect(mockCacheManager.del).toHaveBeenCalledTimes(2);
    });

    it('不带 roleIds 时角色不被改动', async () => {
      const updateDto: UpdateSysPostDto = {
        name: '技术总监V2',
      } as any;

      mockPrismaService.sysPost.findFirst.mockResolvedValue(null);
      mockPrismaService.sysPost.update.mockResolvedValue({
        id: 'post-1',
        ...updateDto,
      });
      mockPrismaService.sysUser.findMany.mockResolvedValue([]);

      await service.update('post-1', updateDto);

      const updateCall = mockPrismaService.sysPost.update.mock.calls[0][0];
      expect(updateCall.data).not.toHaveProperty('roles');
    });
  });

  describe('findOne', () => {
    it('应该包含 roles 关联数据', async () => {
      const mockPost = {
        id: 'post-1',
        name: '技术总监',
        code: 'tech_director',
        roles: [
          { id: 'role-1', name: '超级管理员' },
          { id: 'role-2', name: '技术管理员' },
        ],
      };

      mockPrismaService.sysPost.findUnique.mockResolvedValue(mockPost as any);

      const result = await service.findOne('post-1');

      expect(mockPrismaService.sysPost.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'post-1' },
          include: expect.objectContaining({
            roles: { select: { id: true, name: true } },
          }),
        }),
      );
      expect(result.roles).toHaveLength(2);
    });
  });

  describe('getPostRoleIds', () => {
    it('应该返回岗位关联的角色 ID 列表', async () => {
      mockPrismaService.sysPost.findUnique.mockResolvedValue({
        id: 'post-1',
        roles: [{ id: 'role-1' }, { id: 'role-2' }],
      } as any);

      const result = await service.getPostRoleIds('post-1');

      expect(result).toEqual(['role-1', 'role-2']);
    });

    it('岗位不存在时应该抛出 ApiException', async () => {
      mockPrismaService.sysPost.findUnique.mockResolvedValue(null);

      await expect(service.getPostRoleIds('non-existent')).rejects.toThrow(
        ApiException,
      );
      await expect(service.getPostRoleIds('non-existent')).rejects.toThrow(
        '岗位不存在',
      );
    });
  });

  describe('getOptions', () => {
    it('应该返回包含 roleIds 的岗位选项', async () => {
      mockPrismaService.sysPost.findMany.mockResolvedValue([
        {
          id: 'post-1',
          name: '技术总监',
          code: 'tech_director',
          isLeader: true,
          deptId: null,
          roles: [{ id: 'role-1' }, { id: 'role-2' }],
        },
      ] as any);

      const result = await service.getOptions();

      expect(result[0]).toEqual(
        expect.objectContaining({
          value: 'post-1',
          label: '技术总监',
          isLeader: true,
          roleIds: ['role-1', 'role-2'],
        }),
      );
    });
  });
});
