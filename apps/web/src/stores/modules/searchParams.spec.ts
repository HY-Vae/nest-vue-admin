import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSearchParamsStore } from './searchParams'

describe('useSearchParamsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('saveParams', () => {
    it('should save params with key', () => {
      const store = useSearchParamsStore()

      store.saveParams('user-list', { name: 'test', status: '1' })

      expect(store.paramsMap['user-list']).toEqual({ name: 'test', status: '1' })
    })

    it('should overwrite existing params', () => {
      const store = useSearchParamsStore()

      store.saveParams('user-list', { name: 'test1' })
      store.saveParams('user-list', { name: 'test2' })

      expect(store.paramsMap['user-list']).toEqual({ name: 'test2' })
    })
  })

  describe('getParams', () => {
    it('should return params by key', () => {
      const store = useSearchParamsStore()
      store.saveParams('user-list', { name: 'test' })

      const params = store.getParams('user-list')

      expect(params).toEqual({ name: 'test' })
    })

    it('should return null for non-existent key', () => {
      const store = useSearchParamsStore()

      const params = store.getParams('non-existent')

      expect(params).toBeNull()
    })
  })

  describe('clearParams', () => {
    it('should clear params by key', () => {
      const store = useSearchParamsStore()
      store.saveParams('user-list', { name: 'test' })
      store.saveParams('role-list', { name: 'role' })

      store.clearParams('user-list')

      expect(store.getParams('user-list')).toBeNull()
      expect(store.getParams('role-list')).toEqual({ name: 'role' })
    })
  })

  describe('clearAllParams', () => {
    it('should clear all params', () => {
      const store = useSearchParamsStore()
      store.saveParams('user-list', { name: 'test1' })
      store.saveParams('role-list', { name: 'test2' })

      store.clearAllParams()

      expect(store.paramsMap).toEqual({})
    })
  })

  describe('hasParams', () => {
    it('should return true if params exist', () => {
      const store = useSearchParamsStore()
      store.saveParams('user-list', { name: 'test' })

      expect(store.hasParams('user-list')).toBe(true)
    })

    it('should return false if params do not exist', () => {
      const store = useSearchParamsStore()

      expect(store.hasParams('non-existent')).toBe(false)
    })
  })
})
