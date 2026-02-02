import { Inject, Injectable } from '@nestjs/common';
import {
  CreateSysDictDto,
  GetSysDictListDto,
  UpdateSysDictDto,
} from './dto/req-sys-dict.dto';

import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

import { ApiException } from '@/common/exceptions/api.exception';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { REDIS_KEYS } from '@/common/constants/redisKey.constant';
import { EnableStatusEnum } from '@/common/enums/common.enum';
import { generateRedisKey } from '@/utils/util';

@Injectable()
export class SysDictService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(createSysDictDto: CreateSysDictDto) {
    const exist = await this.prisma.sysDict.findFirst({
      where: {
        code: createSysDictDto.code,
      },
    });
    if (exist) {
      throw new ApiException('字典值已存在');
    }
    return await this.prisma.sysDict.create({
      data: {
        ...createSysDictDto,
      },
    });
  }

  async findAll(query: GetSysDictListDto) {
    const { skip, take } = query;
    const where: Prisma.SysDictWhereInput = {};
    if (query.name) {
      where.name = {
        contains: query.name,
      };
    }
    if (query.code) {
      where.code = {
        contains: query.code,
      };
    }
    if (query.status) {
      where.status = query.status;
    }
    const listPromise = this.prisma.sysDict.findMany({
      where,
      skip,
      take,
    });
    const totalPromise = this.prisma.sysDict.count({
      where,
    });
    const [list, total] = await Promise.all([listPromise, totalPromise]);
    return {
      list,
      total,
    };
  }
  async findAllOptions() {
    const sysDicts = await this.prisma.sysDict.findMany({
      where: {
        status: EnableStatusEnum.ENABLE,
      },
      select: {
        code: true,
        name: true,
      },
    });
    return sysDicts.map((item) => {
      return {
        label: item.name,
        value: item.code,
      };
    });
  }

  async findDicts(codes: string[]) {
    // 这里面拿到所有的code，先从缓存中查找，如果有直接拼接，没有没有则从数据库中查找，再存入缓存，缓存记录的是每一个code和结果的对应关系
    const noCacheCodes: string[] = [];

    const result: Record<any, any> = {};
    const cachePromise: Promise<any>[] = [];
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];
      cachePromise.push(
        this.cacheManager.get(generateRedisKey(REDIS_KEYS.DICT_KEY, code)),
      );
    }
    const cacheResults = await Promise.all(cachePromise);
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];
      if (cacheResults[i]) {
        result[code] = cacheResults[i];
      } else {
        noCacheCodes.push(code);
      }
    }
    if (noCacheCodes.length > 0) {
      const dbResults = await this.prisma.sysDict.findMany({
        where: {
          code: {
            in: noCacheCodes,
          },
        },
        include: {
          details: true,
        },
      });
      for (let i = 0; i < dbResults.length; i++) {
        const dbResult = dbResults[i];
        result[dbResult.code] = dbResult;
        await this.cacheManager.set(
          generateRedisKey(REDIS_KEYS.DICT_KEY, dbResult.code),
          dbResult,
        );
      }
    }
    return result;
  }

  async findOne(code: string) {
    const result = await this.cacheManager.get(
      generateRedisKey(REDIS_KEYS.DICT_KEY, code),
    );
    if (result) {
      return result;
    }
    const dbResult = await this.prisma.sysDict.findFirst({
      where: {
        code,
        status: EnableStatusEnum.ENABLE,
      },
      include: {
        details: true,
      },
    });
    if (dbResult) {
      await this.cacheManager.set(
        generateRedisKey(REDIS_KEYS.DICT_KEY, code),
        dbResult,
      );
    }

    return dbResult;
  }

  async removeCache(codes: string[]) {
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];
      await this.cacheManager.del(generateRedisKey(REDIS_KEYS.DICT_KEY, code));
    }
  }

  async update(id: number, updateSysDictDto: UpdateSysDictDto) {
    const exist = await this.prisma.sysDict.findFirst({
      where: {
        code: updateSysDictDto.code,
        id: {
          not: id,
        },
      },
    });
    if (exist) {
      throw new ApiException('字典值已存在');
    }
    const dict = await this.prisma.sysDict.update({
      where: {
        id,
      },
      data: {
        ...updateSysDictDto,
      },
    });
    await this.removeCache([dict.code]);
    await this.cacheManager.set(
      generateRedisKey(REDIS_KEYS.DICT_KEY, dict.code),
      dict,
    );
    return dict;
  }

  async remove(codes: string[]) {
    // 先查询这个字典下是否有用户
    const user = await this.prisma.sysDictDetail.findFirst({
      where: {
        sysDictCode: {
          in: codes,
        },
      },
    });
    if (user) {
      throw new Error('该字典下有字典详情，请先删除字典详情信息');
    }
    await this.prisma.sysDict.deleteMany({
      where: {
        code: {
          in: codes,
        },
      },
    });
    await this.removeCache(codes);
  }
}
