import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { useSearchParams } from './useSearchParams'
import { useSearchParamsStore } from '@/stores/modules/searchParams'

// Mock vue-router
const mockRoute = {
  name: 'user-list',
  path: '/sys/user',
}

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => mockRoute),
}))

describe('useSearchParams', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('restore', () => {
    it('should restore params from store on mount', async () => {
      const initialParams = { name: '', status: '', current: 1, pageSize: 20 }
      const params = reactive({ ...initialParams })

      // First save params using the store directly
      const store = useSearchParamsStore()
      store.saveParams('user-list', { name: 'test', status: '1', current: 1, pageSize: 20 })

      // Create component which should restore params on mount
      const TestComponent = defineComponent({
        setup() {
          useSearchParams(params)
          return { params }
        },
        template: '<div>{{ params.name }}</div>',
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(params.name).toBe('test')
      expect(params.status).toBe('1')

      wrapper.unmount()
    })
  })

  describe('save', () => {
    it('should save params to store', async () => {
      const params = reactive({
        name: '',
        status: '',
      })

      const TestComponent = defineComponent({
        setup() {
          const { save, hasParams } = useSearchParams(params)
          return { params, save, hasParams }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      params.name = 'test'
      wrapper.vm.save()
      await nextTick()

      const store = useSearchParamsStore()
      expect(store.hasParams('user-list')).toBe(true)
      expect(store.getParams('user-list')?.name).toBe('test')

      wrapper.unmount()
    })
  })

  describe('reset', () => {
    it('should clear params and reset to initial values', async () => {
      const initialParams = { name: '', status: '', current: 1, pageSize: 20 }
      const params = reactive({ ...initialParams })

      const TestComponent = defineComponent({
        setup() {
          const { save, reset } = useSearchParams(params)
          return { params, save, reset }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      params.name = 'test'
      params.current = 5
      wrapper.vm.save()
      await nextTick()

      const store = useSearchParamsStore()
      const savedParams = store.getParams('user-list')
      expect(savedParams?.name).toBe('test')
      expect(savedParams?.current).toBe(5)

      wrapper.vm.reset(initialParams)
      await nextTick()

      // Params object should be reset
      expect(params.name).toBe('')
      expect(params.current).toBe(1)

      wrapper.unmount()
    })
  })

  describe('hasParams', () => {
    it('should return false when no params saved', async () => {
      const params = reactive({
        name: '',
        status: '',
      })

      const TestComponent = defineComponent({
        setup() {
          const { hasParams } = useSearchParams(params)
          return { hasParams }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(wrapper.vm.hasParams()).toBe(false)

      wrapper.unmount()
    })

    it('should return true when params are saved', async () => {
      const params = reactive({
        name: '',
        status: '',
      })

      const TestComponent = defineComponent({
        setup() {
          const { save, hasParams } = useSearchParams(params)
          return { save, hasParams }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      wrapper.vm.save()
      await nextTick()

      expect(wrapper.vm.hasParams()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('custom name', () => {
    it('should use custom name as key', async () => {
      const params = reactive({
        name: '',
      })

      const TestComponent = defineComponent({
        setup() {
          const { save, hasParams } = useSearchParams(params, { name: 'custom-key' })
          return { save, hasParams }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      wrapper.vm.save()
      await nextTick()

      const store = useSearchParamsStore()
      expect(store.hasParams('custom-key')).toBe(true)

      wrapper.unmount()
    })
  })
})
