import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export interface TabItem {
  path: string
  name: string
  title: string
  icon?: string
  closable: boolean
  affix: boolean
}

export const useTabsStore = defineStore(
  'tabs',
  () => {
    const tabs = ref<TabItem[]>([])
    const activeTab = ref('')
    const isRouterAlive = ref(true)
    const contentFullscreen = ref(false)

    const currentTab = computed(() => tabs.value.find((tab) => tab.path === activeTab.value))

    const addTab = (route: RouteLocationNormalized) => {
      const { path, name, meta } = route
      if (!name || name === 'home' || meta.hidden) return

      const title = (meta.title as string) || (name as string)
      const icon = meta.icon as string | undefined
      const closable = meta.closable !== false
      const affix = meta.affix === true

      const exists = tabs.value.find((tab) => tab.path === path)
      if (!exists) {
        tabs.value.push({ path, name: name as string, title, icon, closable, affix })
      }
      activeTab.value = path
    }

    const closeTab = (path: string) => {
      const index = tabs.value.findIndex((tab) => tab.path === path)
      if (index === -1) return null

      const tab = tabs.value[index]
      // 固定的 tab 不允许关闭
      if (tab?.affix) return null

      tabs.value.splice(index, 1)

      if (activeTab.value === path) {
        // 优先跳转到固定 tab，否则跳转到相邻 tab
        const affixTab = tabs.value.find((t) => t.affix)
        const nextTab = tabs.value[index] || tabs.value[index - 1]
        return nextTab ? nextTab.path : affixTab?.path || null
      }
      return null
    }

    const closeOtherTabs = (path: string) => {
      tabs.value = tabs.value.filter((tab) => tab.path === path || tab.affix)
      activeTab.value = path
    }

    const closeLeftTabs = (path: string) => {
      const index = tabs.value.findIndex((tab) => tab.path === path)
      if (index === -1) return

      tabs.value = tabs.value.filter((tab, i) => i >= index || tab.affix)
    }

    const closeRightTabs = (path: string) => {
      const index = tabs.value.findIndex((tab) => tab.path === path)
      if (index === -1) return

      tabs.value = tabs.value.filter((tab, i) => i <= index || tab.affix)
    }

    const closeAllTabs = () => {
      tabs.value = tabs.value.filter((tab) => tab.affix)
      const firstTab = tabs.value[0]
      return firstTab ? firstTab.path : null
    }

    const refresh = async () => {
      isRouterAlive.value = false
      await new Promise((resolve) => setTimeout(resolve, 0))
      isRouterAlive.value = true
    }

    const toggleAffixTab = (path: string) => {
      const tab = tabs.value.find((tab) => tab.path === path)
      if (tab) {
        tab.affix = !tab.affix
      }
    }

    const toggleContentFullscreen = () => {
      contentFullscreen.value = !contentFullscreen.value
    }

    return {
      tabs,
      activeTab,
      isRouterAlive,
      contentFullscreen,
      currentTab,
      addTab,
      closeTab,
      closeOtherTabs,
      closeLeftTabs,
      closeRightTabs,
      closeAllTabs,
      refresh,
      toggleAffixTab,
      toggleContentFullscreen,
    }
  },
  {
    persist: {
      key: 'admin-tabs',
      pick: ['tabs', 'activeTab'],
    },
  },
)
