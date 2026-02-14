import { ApiException } from '@/common/exceptions/api.exception';
import { CurrentUserType } from '@/common/types/auth.type';
import {
  CreateAutoCodeDto,
  GetAutoCodeListDto,
} from '@/modules/tool/auto-code/dto/req-auto-code.dto';
import {
  createBtnAuthMap,
  createBtnAuths,
  createMenuBody,
} from '@/modules/tool/auto-code/utils/auth';
import {
  checkAllRules,
  createGenerateConfig,
  createWebTemp,
  GenerateBaseConfig,
  GenerateConfig,
  generateServerFiles,
  runProjectFormat,
} from '@/modules/tool/auto-code/utils/generate';
import { createPrismaModel } from '@/modules/tool/auto-code/utils/model';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { posix } from 'path';

@Injectable()
export class AutoCodeService {
  constructor(private readonly prisma: PrismaService) {}
  async checkMenuExit(config: GenerateConfig) {
    const menuBody = createMenuBody(config);
    const btnAuths = createBtnAuths(config.authPrefix, config.nameZh);
    // 1.查菜单是否存在
    const menu = await this.prisma.sysMenu.findFirst({
      where: {
        meta: {
          title: menuBody.meta.title,
        },
        auth: menuBody.auth,
      },
    });
    if (menu) {
      return `当前菜单信息 ${menuBody.meta.title} 已存在`;
    }
    // 2.查按钮权限是否存在
    const btns = await this.prisma.sysMenuBtn.findMany({
      where: {
        auth: {
          in: btnAuths,
        },
      },
    });
    if (btns.length > 0) {
      const errMsg = btns.map((btn) => `[${btn.name}(${btn.auth})]`).join(',');
      return `按钮权限 ${errMsg} 已存在`;
    }
    return null;
  }
  async create(createAutoCodeDto: CreateAutoCodeDto, user: CurrentUserType) {
    const temp = await this.prisma.temp.findUnique({
      where: {
        id: createAutoCodeDto.tempId,
      },
    });
    if (!temp) {
      throw new ApiException('模板不存在');
    }
    const baseConfig: GenerateBaseConfig = {
      ...createAutoCodeDto,
      serverPath: temp.tempPath,
    };
    // 1.生成配置参数
    const config = createGenerateConfig(baseConfig);

    // 2.先进行校验
    let errMsg = await checkAllRules(config);
    if (errMsg) throw new ApiException(errMsg);
    errMsg = await this.checkMenuExit(config);
    if (errMsg) throw new ApiException(errMsg);
    // 3.生成服务端代码
    await generateServerFiles(config, temp);
    // 4.生成prisma model
    await createPrismaModel(config);
    // 5.生成前端代码
    await createWebTemp(config);

    // 6.生成权限 - 得先生成
    const menuBody = createMenuBody(config);
    const parentMenu = await this.prisma.sysMenu.findFirst({
      where: {
        meta: {
          title: temp.name,
        },
      },
    });
    if (parentMenu) {
      menuBody.parentId = parentMenu.id;
    }
    await this.prisma.$transaction(async (tx) => {
      let { menuBtns, meta, parameters = [], path, ...others } = menuBody;
      const menuPath = posix.join(parentMenu?.path || '/', path);
      await tx.sysMenu.create({
        data: {
          path: menuPath,
          ...others,

          meta: {
            create: meta,
          },
          menuBtns: {
            createMany: {
              data: createBtnAuthMap(config.authPrefix, config.nameZh),
            },
          },
          parameters: {
            createMany: {
              data: parameters,
            },
          },
        },
      });
      const { fields, ...other } = createAutoCodeDto;
      await tx.autoCode.create({
        data: {
          ...other,
          fields: JSON.stringify(fields),
        },
      });
    });
    runProjectFormat();
    return {
      data: config,
    };
  }

  async createWeb(createAutoCodeDto: CreateAutoCodeDto, user: CurrentUserType) {
    const temp = await this.prisma.temp.findUnique({
      where: {
        id: createAutoCodeDto.tempId,
      },
    });
    if (!temp) {
      throw new ApiException('模板不存在');
    }
    const baseConfig: GenerateBaseConfig = {
      ...createAutoCodeDto,
      serverPath: temp.tempPath,
    };
    // 1.生成配置参数
    const config = createGenerateConfig(baseConfig);
    createWebTemp(config);
    // 6.生成权限 - 得先生成
    const menuBody = createMenuBody(config);
    const parentMenu = await this.prisma.sysMenu.findFirst({
      where: {
        meta: {
          title: temp.name,
        },
      },
    });
    if (parentMenu) {
      menuBody.parentId = parentMenu.id;
    }
    await this.prisma.$transaction(async (tx) => {
      let { menuBtns, parameters = [], meta, ...others } = menuBody;
      await tx.sysMenu.create({
        data: {
          ...others,
          meta: {
            create: meta,
          },
          menuBtns: {
            createMany: {
              data: createBtnAuthMap(config.authPrefix, config.nameZh),
            },
          },
          parameters: {
            createMany: {
              data: parameters,
            },
          },
        },
      });
      const { fields, ...other } = createAutoCodeDto;
      await tx.autoCode.create({
        data: {
          ...other,
          fields: JSON.stringify(fields),
        },
      });
    });
  }

  /* 列表查询 */
  async findAll(query: GetAutoCodeListDto) {
    const { skip, take } = query;
    const where: Prisma.AutoCodeWhereInput = {};

    if (query.name != undefined) {
      where.name = query.name;
    }
    if (query.nameZh != undefined) {
      where.nameZh = query.nameZh;
    }

    if (query.tempId != undefined) {
      where.tempId = query.tempId;
    }

    const listPromise = this.prisma.autoCode.findMany({
      where,
      skip,
      take,
    });
    const totalPromise = this.prisma.autoCode.count({
      where,
    });
    const [list, total] = await Promise.all([listPromise, totalPromise]);
    return {
      list,
      total,
    };
  }

  /* 通过id查询 */
  async findOne(id: number) {
    return this.prisma.autoCode.findUnique({
      where: {
        id,
      },
    });
  }

  /* 删除 */
  async remove(id: number) {
    return await this.prisma.autoCode.delete({
      where: {
        id,
      },
    });
  }

  /* 批量删除 */
  async removes(ids: number[]) {
    return await this.prisma.autoCode.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
