<script setup lang="ts">
import SideMenuItem from '@/components/sideMenu/sideMenuItem.vue'
import router from '@/router'
import { useUserStore } from '@/stores/modules/user.ts'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const { menus } = storeToRefs(userStore)
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
    <el-menu :default-active="activeMenu" class="side-menu" @select="selectOne">
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
    transition: all 0.25s ease;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    &.is-active {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
      font-weight: 500;
    }
  }

  :deep(.el-sub-menu__title) {
    margin: 2px 8px;
    border-radius: 8px;
    height: 42px;
    transition: all 0.25s ease;

    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }

  :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: var(--el-color-primary);
    font-weight: 500;
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
}

html.dark .side-menu {
  :deep(.el-menu-item.is-active) {
    background-color: rgba(64, 158, 255, 0.15);
  }
}
</style>
