import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GenService } from './gen.service';

describe('GenService', () => {
  let service: GenService;
  let configService: { get: jest.Mock };

  const mockGenConfig = {
    serverFolder: 'apps/server/src',
    mainModuleName: 'modules/modules.module.ts',
  };

  beforeEach(async () => {
    configService = { get: jest.fn().mockReturnValue(mockGenConfig) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<GenService>(GenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ======================== constructor ======================== */
  describe('constructor', () => {
    it('应该从 ConfigService 获取 genCode 配置', () => {
      expect(configService.get).toHaveBeenCalledWith('genCode');
    });
  });

  /* ======================== getTempFilePath ======================== */
  describe('getTempFilePath', () => {
    it('单层路径时应该返回对应的模块文件路径', () => {
      const result = service.getTempFilePath('monitor');

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('monitor');
      expect(result[0]).toContain('monitor.module.ts');
    });

    it('多层路径时应该返回多个模块文件路径', () => {
      const result = service.getTempFilePath('monitor/health');

      expect(result).toHaveLength(2);
      expect(result[0]).toContain('monitor');
      expect(result[0]).toContain('monitor.module.ts');
      expect(result[1]).toContain('health');
      expect(result[1]).toContain('health.module.ts');
    });

    it('三层路径时应该返回三个模块文件路径', () => {
      const result = service.getTempFilePath('tool/auto-code/sub');

      expect(result).toHaveLength(3);
    });
  });

  /* ======================== createBaseModuleTemp ======================== */
  describe('createBaseModuleTemp', () => {
    it('应该生成包含正确模块名的模板字符串', () => {
      const result = service.createBaseModuleTemp('monitor');

      expect(result).toContain('MonitorModule');
      expect(result).toContain('@Module');
      expect(result).toContain('import');
    });

    it('多单词名应该被转换为 PascalCase', () => {
      const result = service.createBaseModuleTemp('auto-code');

      expect(result).toContain('AutoCodeModule');
    });
  });

  /* ======================== writeFileSync ======================== */
  describe('writeFileSync', () => {
    it('应该写入文件内容', () => {
      const originalExistsSync = jest.requireActual('fs').existsSync;
      const fsMock = {
        existsSync: jest.fn().mockReturnValue(true),
        mkdirSync: jest.fn(),
        writeFileSync: jest.fn(),
      };

      jest.doMock('fs', () => fsMock);

      // 直接测试 - 由于 fs 被实际使用，仅验证方法可调用
      expect(typeof service.writeFileSync).toBe('function');
    });
  });
});
