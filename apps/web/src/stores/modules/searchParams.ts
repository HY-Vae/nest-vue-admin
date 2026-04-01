import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchParamsStore = defineStore(
  'searchParams',
  () => {
    const paramsMap = ref<Record<string, Record<string, unknown>>>({})

    // 保存搜索条件
    const saveParams = (key: string, params: Record<string, unknown>) => {
      paramsMap.value[key] = params
    }

    // 获取搜索条件
    const getParams = (key: string): Record<string, unknown> | null => {
      return paramsMap.value[key] || null
    }

    // 清除指定 key 的搜索条件
    const clearParams = (key: string) => {
      delete paramsMap.value[key]
    }

    // 清除所有搜索条件
    const clearAllParams = () => {
      paramsMap.value = {}
    }

    // 检查是否存在搜索条件
    const hasParams = (key: string): boolean => {
      return !!paramsMap.value[key]
    }

    return {
      paramsMap,
      saveParams,
      getParams,
      clearParams,
      clearAllParams,
      hasParams,
    }
  },
  {
    persist: {
      key: 'admin-search-params',
    },
  },
)
