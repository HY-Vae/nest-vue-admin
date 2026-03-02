import { generateUUid } from '@/utils/util';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateSysDeptDto,
  GetSysDeptListDto,
  UpdateSysDeptDto,
} from './dto/req-sysDept.dto';

@Injectable()
export class SysDeptService {
  constructor(private readonly prisma: PrismaService) {}

  /* 新增 */
  async create(createSysDeptDto: CreateSysDeptDto) {
    return this.prisma.sysDept.create({
      data: {
        ...createSysDeptDto,
        id: generateUUid(),
      },
    });
  }

  /* 列表查询 */
  async findAll(query: GetSysDeptListDto) {
    const { skip, take } = query;
    const where: Prisma.SysDeptWhereInput = {};

    if (query.deptName != undefined) {
      where.deptName = {
        contains: query.deptName,
      };
    }
    if (query.deptCode != undefined) {
      where.deptCode = {
        contains: query.deptCode,
      };
    }
    if (query.status != undefined) {
      where.status = query.status;
    }

    const listPromise = this.prisma.sysDept.findMany({
      where,
      skip,
      take,
    });
    const totalPromise = this.prisma.sysDept.count({
      where,
    });
    const [list, total] = await Promise.all([listPromise, totalPromise]);
    return {
      list,
      total,
    };
  }

  /* 通过id查询 */
  async findOne(id: string) {
    return this.prisma.sysDept.findUnique({
      where: {
        id,
      },
    });
  }

  /* 更新 */
  async update(id: string, updateSysDeptDto: UpdateSysDeptDto) {
    return await this.prisma.sysDept.update({
      where: {
        id,
      },
      data: updateSysDeptDto,
    });
  }

  /* 删除 */
  async remove(id: string) {
    return await this.prisma.sysDept.delete({
      where: {
        id,
      },
    });
  }

  /* 批量删除 */
  async removes(ids: string[]) {
    return await this.prisma.sysDept.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
