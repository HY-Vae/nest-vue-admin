// 获取特定图标集的所有图标
import type { IconifyResult, IconResult } from '@/views/sys/menu/menu.type'

const iconsMap = new Map<string, IconResult>()

export const fetchIconsFromCollection = async (prefix: string): Promise<IconResult | null> => {
  try {
    if (iconsMap.has(prefix)) {
      return iconsMap.get(prefix) as IconResult
    }
    const response = await fetch(`https://api.iconify.design/collection?prefix=${prefix}`)
    const iconifyResult = (await response.json()) as IconifyResult
    const iconResult: IconResult = {
      icons: [],
      total: iconifyResult.total,
    }
    for (const [key, value] of Object.entries(iconifyResult.categories)) {
      iconResult.icons.push(...value.map((item) => `${prefix}:${item}`))
    }
    iconsMap.set(prefix, iconResult)
    return iconResult
  } catch (error) {
    console.error(`获取 ${prefix} 图标集失败:`, error)
    return null
  }
}
