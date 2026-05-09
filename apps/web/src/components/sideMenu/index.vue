<script setup lang="ts">
import SideMenuItem from '@/components/sideMenu/sideMenuItem.vue'
import router from '@/router'
import { useThemeStore } from '@/stores/modules/theme.ts'
import { useUserStore } from '@/stores/modules/user.ts'
import type { MenuListType } from '@/views/sys/menu/menu.type'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = withDefaults(
  defineProps<{
    menus?: MenuListType[]
  }>(),
  { menus: undefined },
)

const userStore = useUserStore()
const themeStore = useThemeStore()
const { isCollapse } = storeToRefs(themeStore)
const route = useRoute()

const menuData = computed(() => props.menus ?? userStore.menus)

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
      <side-menu-item v-for="item in menuData" :key="item.id" :menu="item" />
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.side-menu {
  border-right: none !important;
  background: transparent !important;
  padding: 10px 0;

  --el-menu-bg-color: transparent;
  --el-menu-text-color: rgba(255, 255, 255, 0.7);
  --el-menu-hover-bg-color: rgba(255, 255, 255, 0.06);
  --el-menu-active-color: #ffffff;

  :deep(.el-menu-item) {
    margin: 2px 10px;
    border-radius: 8px;
    height: 44px;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }

    &.is-active {
      color: #ffffff;
      background: linear-gradient(90deg, rgba(64, 158, 255, 0.25) 0%, rgba(64, 158, 255, 0.08) 100%);
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background: linear-gradient(180deg, var(--el-color-primary), rgba(64, 158, 255, 0.6));
        border-radius: 0 3px 3px 0;
      }

      .menu-icon {
        color: #ffffff;
      }
    }
  }

  :deep(.el-sub-menu__title) {
    margin: 2px 10px;
    border-radius: 8px;
    height: 44px;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }
  }

  :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: rgba(255, 255, 255, 0.95);
    font-weight: 500;

    .menu-icon {
      color: rgba(255, 255, 255, 0.95);
    }
  }

  :deep(.el-sub-menu__icon-arrow) {
    transition: transform 0.3s ease;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }

  :deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow) {
    transform: rotate(180deg);
    color: rgba(255, 255, 255, 0.6);
  }

  :deep(.el-menu--inline) {
    background: transparent !important;

    .el-menu-item {
      padding-left: 48px !important;
      height: 40px;
      font-size: 13px;
    }
  }

  // 折叠状态样式
  &.el-menu--collapse {
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      margin: 2px 8px;
      justify-content: center;
      padding: 0 !important;

      &:hover {
        transform: none;
      }
    }

    :deep(.el-menu-item.is-active::before) {
      left: -8px;
    }
  }
}

/* 浅色模式 */
html:not(.dark) .side-menu {
  --el-menu-text-color: #606266;
  --el-menu-hover-bg-color: rgba(0, 0, 0, 0.04);
  --el-menu-active-color: var(--el-color-primary);

  :deep(.el-menu-item) {
    color: #606266;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
      color: var(--el-text-color-primary);
    }

    &.is-active {
      color: var(--el-color-primary);
      background: rgba(64, 158, 255, 0.06);
      box-shadow: none;

      &::before {
        background: var(--el-color-primary);
      }

      .menu-icon {
        color: var(--el-color-primary);
      }
    }
  }

  :deep(.el-sub-menu__title) {
    color: #606266;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
      color: var(--el-text-color-primary);
    }
  }

  :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: var(--el-text-color-primary);

    .menu-icon {
      color: var(--el-text-color-primary);
    }
  }

  :deep(.el-sub-menu__icon-arrow) {
    color: #909399;
  }

  :deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow) {
    color: #606266;
  }
}
</style>

<style lang="scss">
// 折叠状态弹出菜单样式（需要全局样式，因为弹出菜单是 teleport 到 body 的）
.el-menu--vertical {
  .el-menu--popup {
    min-width: 180px;
    padding: 8px 0;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    background: #22252e;

    .el-menu-item {
      height: 40px;
      line-height: 40px;
      padding: 0 16px !important;
      margin: 2px 8px;
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        background-color: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.95);
      }

      &.is-active {
        color: #ffffff;
        background: linear-gradient(90deg, rgba(64, 158, 255, 0.25) 0%, rgba(64, 158, 255, 0.08) 100%);
        font-weight: 500;
      }
    }

    .el-sub-menu__title {
      height: 40px;
      line-height: 40px;
      padding: 0 16px !important;
      margin: 2px 8px;
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        background-color: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.95);
      }
    }
  }
}

// 浅色模式弹出菜单
html:not(.dark) .el-menu--vertical {
  .el-menu--popup {
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

    .el-menu-item {
      color: #606266;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
        color: var(--el-text-color-primary);
      }

      &.is-active {
        color: var(--el-color-primary);
        background: rgba(64, 158, 255, 0.06);
      }
    }

    .el-sub-menu__title {
      color: #606266;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>
