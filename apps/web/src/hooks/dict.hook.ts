import { getDictOneApi } from '@/api/dict'
import type { SelectOptionItem } from '@/types/global'

export const useDict = () => {
  //   1.根据code获取字典
  const getDictByCode = async (code: string) => {
    const result = await getDictOneApi(code)
    return result.data
  }

  const getDictOptions = async (code: string): Promise<SelectOptionItem[]> => {
    const result = await getDictByCode(code)
    return result.details.map((item) => ({
      label: item.label,
      value: item.value,
    }))
  }

  const getDictLabel = <T = string>(options: SelectOptionItem<T>[], value: T) => {
    const target = options.find((item) => item.value === value)
    return target?.label || ''
  }

  return {
    getDictByCode,
    getDictOptions,
    getDictLabel,
  }
}
