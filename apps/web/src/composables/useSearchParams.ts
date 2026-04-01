import { useSearchParamsStore } from '@/stores/modules/searchParams'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

export interface UseSearchParamsOptions {
  /** 自定义名称，默认使用当前路由名称 */
  name?: string
}

/**
 * 搜索条件保存恢复 composable
 *
 * 功能：
 * - 搜索条件变化时自动保存
 * - 页面加载/刷新时自动恢复
 * - 跳转其他页面再返回时自动恢复
 *
 * @param params 响应式的搜索参数对象
 * @param options 配置选项
 *
 * @example
 * ```ts
 * const searchForm = reactive({
 *   keyword: '',
 *   status: '',
 *   pageNum: 1,
 *   pageSize: 10,
 * })
 *
 * const { reset } = useSearchParams(searchForm)
 *
 * // 重置搜索条件（会清除保存的条件）
 * reset({ keyword: '', status: '', pageNum: 1, pageSize: 10 })
 * ```
 */
export function useSearchParams<T extends Record<string, unknown>>(
  params: T,
  options: UseSearchParamsOptions = {},
) {
  const { name } = options
  const route = useRoute()
  const store = useSearchParamsStore()

  const key = name || (route.name as string) || route.path
  let isRestoring = false

  // 保存搜索条件
  const save = () => {
    store.saveParams(key, JSON.parse(JSON.stringify(params)))
  }

  // 恢复搜索条件
  const restore = (): boolean => {
    const savedParams = store.getParams(key)
    if (savedParams) {
      isRestoring = true
      Object.assign(params, savedParams)
      isRestoring = false
      return true
    }
    return false
  }

  // 重置搜索条件（清除保存的条件并重置为初始值）
  const reset = (initialParams?: Partial<T>) => {
    store.clearParams(key)
    if (initialParams) {
      Object.assign(params, initialParams)
    }
  }

  // 是否有保存的条件
  const hasParams = () => store.hasParams(key)

  // 页面加载时恢复
  onMounted(() => {
    restore()
  })

  // 监听参数变化自动保存（排除恢复时的触发）
  watch(
    () => ({ ...params }),
    () => {
      if (!isRestoring) {
        save()
      }
    },
    { deep: true, immediate: false },
  )

  return {
    /** 手动保存 */
    save,
    /** 手动恢复 */
    restore,
    /** 重置并清除保存的条件 */
    reset,
    /** 检查是否有保存的条件 */
    hasParams,
  }
}
