import { Inject, Injectable } from '@nestjs/common';
import {
  CreateSysDictDetailDto,
  GetSysDictDetailListDto,
  RemoveSysDictDetailDto,
  RemoveSysDictDetailsDto,
  UpdateSysDictDetailDto,
} from './dto/req-sys-dict-detail.dto';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { REDIS_KEYS } from '@/common/constants/redisKey.constant';
import { ApiException } from '@/common/exceptions/api.exception';
import { generateRedisKey } from '@/utils/util';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class SysDictDetailService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async removeCache(code: string) {
    await this.cacheManager.del(generateRedisKey(REDIS_KEYS.DICT_KEY, code));
  }
  async create(createSysDictDetailDto: CreateSysDictDetailDto) {
    const exist = await this.prisma.sysDictDetail.findFirst({
      where: {
        value: createSysDictDetailDto.value,
        sysDictCode: createSysDictDetailDto.sysDictCode,
      },
    });
    if (exist) {
      throw new ApiException('字典值已存在');
    }
    const detail = await this.prisma.sysDictDetail.create({
      data: {
        ...createSysDictDetailDto,
      },
    });
    await this.removeCache(detail.sysDictCode);
    return detail;
  }

  async findAll(query: GetSysDictDetailListDto) {
    const { skip, take } = query;
    const where: Prisma.SysDictDetailWhereInput = {};
    where.sysDictCode = query.sysDictCode;
    if (query.label) {
      where.label = {
        contains: query.label,
      };
    }
    if (query.value) {
      where.value = {
        contains: query.value,
      };
    }
    if (query.status) {
      where.status = query.status;
    }
    const listPromise = this.prisma.sysDictDetail.findMany({
      where,
      skip,
      take,
    });
    const totalPromise = this.prisma.sysDictDetail.count({
      where,
    });
    const [list, total] = await Promise.all([listPromise, totalPromise]);
    return {
      list,
      total,
    };
  }

  async findOne(id: number) {
    return await this.prisma.sysDictDetail.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateSysDictDetailDto: UpdateSysDictDetailDto) {
    const exist = await this.prisma.sysDictDetail.findFirst({
      where: {
        value: updateSysDictDetailDto.value,
        sysDictCode: updateSysDictDetailDto.sysDictCode,
        id: {
          not: id,
        },
      },
    });
    if (exist) {
      throw new ApiException('字典值已存在');
    }
    const detail = await this.prisma.sysDictDetail.update({
      where: {
        id,
      },
      data: {
        ...updateSysDictDetailDto,
      },
    });
    await this.removeCache(detail.sysDictCode);
    return detail;
  }
  async remove(id: number, body: RemoveSysDictDetailDto) {
    await this.prisma.sysDictDetail.delete({
      where: {
        id,
      },
    });
    await this.removeCache(body.sysDictCode);
  }

  async removes(body: RemoveSysDictDetailsDto) {
    if (!body.ids || body.ids.length === 0) {
      throw new ApiException('参数异常');
    }
    await this.prisma.sysDictDetail.deleteMany({
      where: {
        id: {
          in: body.ids,
        },
        sysDictCode: body.sysDictCode,
      },
    });
    await this.removeCache(body.sysDictCode);
  }
}
