<script setup lang="ts">
import SideMenuItem from '@/components/sideMenu/sideMenuItem.vue'
import router from '@/router'
import { useThemeStore } from '@/stores/modules/theme.ts'
import { useUserStore } from '@/stores/modules/user.ts'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const themeStore = useThemeStore()
const { menus } = storeToRefs(userStore)
const { isCollapse } = storeToRefs(themeStore)
const route = useRoute()

const selectOne = (name: string) => {
  if (name.startsWith('http')) {
    window.open(name)
    return
  }
  router.push({ name })
}
const activeMenu = computed(() => {
  return (route.meta?.activeName || route.name) as string
})
</script>

<template>
  <el-scrollbar class="h-full">
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      class="side-menu"
      @select="selectOne"
    >
      <side-menu-item v-for="item in menus" :key="item.id" :menu="item" />
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.side-menu {
  border-right: none !important;
  background: transparent !important;
  padding: 8px 0;
  :deep(.el-menu-item) {
    margin: 2px 8px;
    border-radius: 8px;
    height: 42px;
    transition: background-color 0.25s ease;
    position: relative;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    &.is-active {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
      font-weight: 500;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background-color: var(--el-color-primary);
        border-radius: 0 2px 2px 0;
      }

      .menu-icon {
        color: var(--el-color-primary);
      }
    }
  }

  :deep(.el-sub-menu__title) {
    margin: 2px 8px;
    border-radius: 8px;
    height: 42px;
    transition: background-color 0.25s ease;

    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }

  :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: var(--el-color-primary);
    font-weight: 500;

    .menu-icon {
      color: var(--el-color-primary);
    }
  }

  :deep(.el-sub-menu__icon-arrow) {
    transition: transform 0.3s ease;
    font-size: 12px;
  }

  :deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow) {
    transform: rotate(180deg);
  }

  :deep(.el-menu--inline) {
    background: transparent !important;

    .el-menu-item {
      padding-left: 48px !important;
      height: 38px;
      font-size: 13px;
    }
  }

  // 折叠状态样式
  &.el-menu--collapse {
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      margin: 2px 6px;
      justify-content: center;
      padding: 0 !important;

      &:hover {
        transform: none;
      }
    }

    :deep(.el-menu-item.is-active::before) {
      left: -6px;
    }
  }
}

html.dark .side-menu {
  :deep(.el-menu-item.is-active) {
    background-color: rgba(64, 158, 255, 0.15);
  }
}
</style>

<style lang="scss">
// 折叠状态弹出菜单样式（需要全局样式，因为弹出菜单是 teleport 到 body 的）
.el-menu--vertical {
  .el-menu--popup {
    min-width: 180px;
    padding: 8px 0;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);

    .el-menu-item {
      height: 40px;
      line-height: 40px;
      padding: 0 16px !important;
      margin: 2px 8px;
      border-radius: 6px;

      &:hover {
        background-color: var(--el-fill-color-light);
      }

      &.is-active {
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);
        font-weight: 500;
      }
    }

    .el-sub-menu__title {
      height: 40px;
      line-height: 40px;
      padding: 0 16px !important;
      margin: 2px 8px;
      border-radius: 6px;

      &:hover {
        background-color: var(--el-fill-color-light);
      }
    }
  }
}

html.dark .el-menu--vertical .el-menu--popup {
  .el-menu-item.is-active {
    background-color: rgba(64, 158, 255, 0.15);
  }
}
</style>
