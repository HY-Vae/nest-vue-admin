import { Injectable } from '@nestjs/common';
import {
  CreateTempDto,
  GetTempListDto,
  UpdateTempDto,
} from './dto/req-temp.dto';

import { PrismaService } from 'nestjs-prisma';

import { EnableStatusEnum } from '@/common/enums/common.enum';
import { ApiException } from '@/common/exceptions/api.exception';
import type { CurrentUserType } from '@/common/types/auth.type';
import { GenService } from '@/modules/tool/gen/gen.service';
import { generateUUid } from '@/utils/util';
import { Prisma } from '@prisma/client';

@Injectable()
export class TempService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly genService: GenService,
  ) {}
  async create(createTempDto: CreateTempDto, user: CurrentUserType) {
    const exist = await this.prisma.temp.findFirst({
      where: {
        code: createTempDto.code,
      },
    });
    if (exist) {
      throw new ApiException('模板code已存在');
    }
    // 1. 循环建立模块，以及模块引用
    await this.genService.genTempModule(
      createTempDto.name,
      createTempDto.code,
      createTempDto.tempPath,
    );
    // 查找一级菜单的数量
    const count = await this.prisma.sysMenu.count({
      where: {
        parentId: null,
      },
    });
    // 进行事务保存
    return await this.prisma.$transaction(async (tx) => {
      // 创建一级目录
      await tx.sysMenu.create({
        data: {
          name: createTempDto.code,
          path: '/' + createTempDto.code,
          component: 'views/layout/basic.vue',
          auth: createTempDto.code,
          status: EnableStatusEnum.ENABLE,
          sort: count + 1,
          parentId: null,
          createBy: user.nickName,
          meta: {
            create: {
              title: createTempDto.name,
              keepAlive: false,
            },
          },
        },
      });
      await this.prisma.temp.create({
        data: {
          ...createTempDto,
          id: generateUUid(),
        },
      });
    });
  }

  async findAll(query: GetTempListDto) {
    const { skip, take } = query;
    const where: Prisma.TempWhereInput = {};
    if (query.name) {
      where.name = {
        contains: query.name,
      };
    }
    if (query.code) {
      where.code = query.code;
    }
    const listPromise = this.prisma.temp.findMany({
      where,
      skip,
      take,
    });
    const totalPromise = this.prisma.temp.count({
      where,
    });
    const [list, total] = await Promise.all([listPromise, totalPromise]);
    return {
      list,
      total,
    };
  }

  async findOptions() {
    return this.prisma.temp.findMany();
  }

  async findOne(id: string) {
    return this.prisma.temp.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateTempDto: UpdateTempDto) {
    const exist = await this.prisma.temp.findFirst({
      where: {
        code: updateTempDto.code,
        id: {
          not: id,
        },
      },
    });
    if (exist) {
      throw new ApiException('模板code已存在');
    }
    return this.prisma.temp.update({
      where: {
        id,
      },
      data: {
        ...updateTempDto,
      },
    });
  }
  async remove(id: string) {
    const temp = await this.prisma.temp.findUnique({
      where: { id },
    });
    if (!temp) {
      throw new ApiException('数据不存在，删除失败！');
    }
    await this.prisma.temp.delete({
      where: {
        id,
      },
    });
  }

  async removes(ids: string[]) {
    await this.prisma.temp.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
