import { SearchTypeEnum } from '@/common/enums/gen.enum';
import { FieldDto } from '../../dto/req-auto-code.dto';

export function createQueryHelper(item: FieldDto) {
  if (item.isSearch) {
    switch (item.searchType) {
      case SearchTypeEnum.EQ:
        return `if (query.${item.name} != undefined) {
          where.${item.name} = query.${item.name}
        }`;
      case SearchTypeEnum.LIKE:
        return `if (query.${item.name} != undefined) {
          where.${item.name} = { contains: query.${item.name} }
        }`;
      case SearchTypeEnum.GT:
        return `if (query.${item.name} != undefined) {
            where.${item.name} = { gt: query.${item.name} }
          }`;
      case SearchTypeEnum.GTE:
        return `if (query.${item.name} != undefined) {
            where.${item.name} = { gte: query.${item.name} }
          }`;
      case SearchTypeEnum.LT:
        return `if (query.${item.name} != undefined) {
              where.${item.name} = { lt: query.${item.name} }
            }`;
      case SearchTypeEnum.LTE:
        return `if (query.${item.name} != undefined) {
                where.${item.name} = { lte: query.${item.name} }
              }`;
    }
  }
  return '';
}
