import { FieldTypeEnum, GenTypeEnum } from '@/enums/gen.enum.ts'
import { fieldTypeShowMap, formItemTypeOptions } from '@/views/tool/gen/constant.ts'
import type { SelectOptionItem } from '@/types/global.ts'

export function filterShowType(key: FieldTypeEnum) {
  let options: SelectOptionItem<GenTypeEnum>[] = []
  const types = fieldTypeShowMap[key]
  for (let i = 0; i < types.length; i++) {
    const target = formItemTypeOptions.find((item) => item.value === types[i])

    if (target) {
      options.push(target)
    }
  }
  return options
}
