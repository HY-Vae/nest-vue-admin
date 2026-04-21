import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLockStore = defineStore('lock', () => {
  const isLocked = ref(false)

  const lock = () => {
    isLocked.value = true
  }

  const unlock = () => {
    isLocked.value = false
  }

  return { isLocked, lock, unlock }
}, {
  persist: {
    pick: ['isLocked'],
  },
})
