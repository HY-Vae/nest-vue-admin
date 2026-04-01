<script setup lang="ts">
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Refresh,
  Close,
  Paperclip,
} from '@element-plus/icons-vue'
import Icon from '@/components/icon/icon.vue'
import { useTabsStore } from '@/stores/modules/tabs'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tabsStore = useTabsStore()

const scrollRef = ref<HTMLElement>()
const contextMenuVisible = ref(false)
const contextMenuStyle = ref({ left: '0px', top: '0px' })
const selectedTab = ref<string>('')

const selectedTabItem = computed(() => {
  return tabsStore.tabs.find((tab) => tab.path === selectedTab.value)
})

// 是否可以关闭当前选中的 tab
const canCloseSelectedTab = computed(() => {
  if (!selectedTabItem.value) return false
  if (selectedTabItem.value.affix) return false
  const closableTabs = tabsStore.tabs.filter((t) => !t.affix)
  return closableTabs.length > 1
})

// 点击空白处关闭右键菜单
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.context-menu')) {
    contextMenuVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // 页面刷新后滚动到激活的 tab
  scrollToActiveTab()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 点击 tab
const handleClick = (path: string) => {
  tabsStore.activeTab = path
  router.push(path)
}

// 关闭 tab
const handleClose = (e: MouseEvent, path: string) => {
  e.stopPropagation()
  const nextPath = tabsStore.closeTab(path)
  if (nextPath !== null) {
    router.push(nextPath)
  }
}

// 右键菜单
const handleContextMenu = (e: MouseEvent, path: string) => {
  e.preventDefault()
  selectedTab.value = path
  contextMenuStyle.value = {
    left: `${e.clientX}px`,
    top: `${e.clientY}px`,
  }
  contextMenuVisible.value = true
}

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenuVisible.value = false
}

// 右键菜单操作
const handleContextCommand = (command: string) => {
  const path = selectedTab.value
  switch (command) {
    case 'refresh':
      tabsStore.refresh()
      break
    case 'pin':
      tabsStore.toggleAffixTab(path)
      // 固定/取消固定后不关闭菜单，允许继续操作
      return
    case 'close': {
      const nextPath = tabsStore.closeTab(path)
      if (nextPath) {
        router.push(nextPath)
      }
      break
    }
    case 'closeOther':
      tabsStore.closeOtherTabs(path)
      router.push(path)
      break
    case 'closeLeft':
      tabsStore.closeLeftTabs(path)
      break
    case 'closeRight':
      tabsStore.closeRightTabs(path)
      break
  }
  closeContextMenu()
}

// 下拉菜单操作
const handleCommand = (command: string) => {
  const currentPath = tabsStore.activeTab
  switch (command) {
    case 'refresh':
      tabsStore.refresh()
      break
    case 'closeOther':
      tabsStore.closeOtherTabs(currentPath)
      break
    case 'closeLeft':
      tabsStore.closeLeftTabs(currentPath)
      break
    case 'closeRight':
      tabsStore.closeRightTabs(currentPath)
      break
    case 'closeAll': {
      const nextPath = tabsStore.closeAllTabs()
      if (nextPath) {
        router.push(nextPath)
      }
      break
    }
  }
}

// 滚动
const scroll = (direction: 'left' | 'right') => {
  const el = scrollRef.value
  if (!el) return
  const step = 200
  el.scrollBy({
    left: direction === 'left' ? -step : step,
    behavior: 'smooth',
  })
}

// 滚动到当前 tab
const scrollToActiveTab = () => {
  nextTick(() => {
    const el = scrollRef.value
    if (!el) return
    const activeTab = el.querySelector('.tab-item.active') as HTMLElement
    if (!activeTab) return
    const containerWidth = el.offsetWidth
    const tabLeft = activeTab.offsetLeft
    const tabWidth = activeTab.offsetWidth
    const scrollLeft = el.scrollLeft

    if (tabLeft < scrollLeft) {
      el.scrollTo({ left: tabLeft - 10, behavior: 'smooth' })
    } else if (tabLeft + tabWidth > scrollLeft + containerWidth) {
      el.scrollTo({ left: tabLeft + tabWidth - containerWidth + 10, behavior: 'smooth' })
    }
  })
}

// 监听路由变化滚动到当前 tab
router.afterEach(() => {
  scrollToActiveTab()
})
</script>

<template>
  <div class="tabs-container">
    <!-- 左滚动按钮 -->
    <div class="scroll-btn" @click="scroll('left')">
      <el-icon><arrow-left /></el-icon>
    </div>

    <!-- tabs 滚动区域 -->
    <div ref="scrollRef" class="tabs-scroll">
      <div
        v-for="tab in tabsStore.tabs"
        :key="tab.path"
        :class="['tab-item', { active: tabsStore.activeTab === tab.path }]"
        @click="handleClick(tab.path)"
        @contextmenu="handleContextMenu($event, tab.path)"
      >
        <Icon v-if="tab.icon" :icon="tab.icon" :size="14" />
        <span class="tab-title">{{ tab.title }}</span>
        <el-icon
          v-if="tab.affix"
          class="tab-affix"
        >
          <paperclip />
        </el-icon>
        <el-icon
          v-else
          class="tab-close"
          @click="(e: MouseEvent) => handleClose(e, tab.path)"
        >
          <close />
        </el-icon>
      </div>
    </div>

    <!-- 右滚动按钮 -->
    <div class="scroll-btn" @click="scroll('right')">
      <el-icon><arrow-right /></el-icon>
    </div>

    <!-- 更多操作 -->
    <el-dropdown @command="handleCommand">
      <div class="more-btn">
        <el-icon><arrow-down /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :icon="Refresh" command="refresh">刷新当前</el-dropdown-item>
          <el-dropdown-item :icon="Close" command="closeOther">关闭其他</el-dropdown-item>
          <el-dropdown-item command="closeLeft">关闭左侧</el-dropdown-item>
          <el-dropdown-item command="closeRight">关闭右侧</el-dropdown-item>
          <el-dropdown-item command="closeAll">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 右键菜单 -->
    <teleport to="body">
      <div
        v-show="contextMenuVisible"
        class="context-menu"
        :style="contextMenuStyle"
      >
        <div class="context-menu-item" @click="handleContextCommand('refresh')">
          <el-icon><refresh /></el-icon>
          <span>刷新</span>
        </div>
        <div class="context-menu-item" @click="handleContextCommand('pin')">
          <el-icon><paperclip /></el-icon>
          <span>{{ selectedTabItem?.affix ? '取消固定' : '固定' }}</span>
        </div>
        <div
          :class="['context-menu-item', { disabled: !canCloseSelectedTab }]"
          @click="canCloseSelectedTab && handleContextCommand('close')"
        >
          <el-icon><close /></el-icon>
          <span>关闭</span>
        </div>
        <div class="context-menu-item" @click="handleContextCommand('closeOther')">
          关闭其他
        </div>
        <div class="context-menu-item" @click="handleContextCommand('closeLeft')">
          关闭左侧
        </div>
        <div class="context-menu-item" @click="handleContextCommand('closeRight')">
          关闭右侧
        </div>
      </div>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.tabs-container {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-lighter);
  gap: 4px;

  .scroll-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    cursor: pointer;
    border-radius: 4px;
    color: var(--el-text-color-regular);
    flex-shrink: 0;

    &:hover {
      background: var(--el-fill-color-light);
      color: var(--el-color-primary);
    }
  }

  .tabs-scroll {
    flex: 1;
    display: flex;
    gap: 6px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 2px 0;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .tab-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--el-fill-color);
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
    font-size: 13px;
    color: var(--el-text-color-regular);
    border: 1px solid var(--el-border-color-lighter);
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary-light-5);
    }

    &.active {
      color: #fff;
      background: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }

    .tab-title {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tab-affix,
    .tab-close {
      width: 14px;
      height: 14px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .tab-affix {
      color: var(--el-color-primary);
    }

    &.active .tab-affix {
      color: #fff;
    }

    .tab-close:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    &.active .tab-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .more-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    cursor: pointer;
    border-radius: 4px;
    color: var(--el-text-color-regular);
    flex-shrink: 0;

    &:hover {
      background: var(--el-fill-color-light);
      color: var(--el-color-primary);
    }
  }
}

.context-menu {
  position: fixed;
  background: var(--el-bg-color);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
  padding: 4px 0;
  z-index: 3000;
  min-width: 100px;

  .context-menu-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 13px;
    color: var(--el-text-color-regular);
    transition: all 0.2s;

    &:hover {
      background: var(--el-fill-color-light);
      color: var(--el-color-primary);
    }

    &.disabled {
      cursor: not-allowed;
      color: var(--el-text-color-disabled);

      &:hover {
        background: transparent;
        color: var(--el-text-color-disabled);
      }
    }
  }
}
</style>
