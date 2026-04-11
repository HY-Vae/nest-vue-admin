<script setup lang="ts">
import TheHeader from '@/components/header/TheHeader.vue'
import SideMenu from '@/components/sideMenu/index.vue'
import TabsView from '@/components/tabs/TabsView.vue'
import { useTabsStore } from '@/stores/modules/tabs'
import { useThemeStore } from '@/stores/modules/theme'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tabsStore = useTabsStore()
const themeStore = useThemeStore()
const { isCollapse } = storeToRefs(themeStore)
const { contentFullscreen } = storeToRefs(tabsStore)

watch(
  () => route.path,
  () => {
    tabsStore.addTab(route)
  },
  { immediate: true },
)
</script>

<template>
  <div class="nva-container">
    <div v-show="!contentFullscreen" class="aside" :class="{ 'is-collapse': isCollapse }">
      <div class="logo">
        <img src="@/assets/logo.svg" alt="logo" class="logo-img" />
        <span class="logo-text" v-show="!isCollapse">Nest-Vue-Admin</span>
      </div>
      <side-menu />
    </div>
    <div class="main">
      <the-header v-show="!contentFullscreen" />
      <tabs-view />
      <div class="content">
        <div class="router-view">
          <router-view v-if="tabsStore.isRouterAlive" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nva-container {
  height: 100%;
  display: flex;
  .aside {
    width: 200px;
    height: 100%;
    flex: 0 0 200px;
    background: var(--el-bg-color);
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--el-border-color-lighter);
    transition:
      width 0.3s ease,
      flex 0.3s ease;

    &.is-collapse {
      width: 64px;
      flex: 0 0 64px;

      .logo {
        justify-content: center;
        padding: 0;
      }
    }

    .logo {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      flex-shrink: 0;
      padding: 0 6px;
      transition: all 0.3s ease;

      .logo-img {
        width: 28px;
        height: 28px;
        flex-shrink: 0;
      }

      .logo-text {
        font-size: 18px;
        font-weight: 600;
        color: var(--el-color-primary);
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  .main {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color-page);
    .content {
      flex: 1;
      min-height: 0;
      .router-view {
        padding: 20px;
        height: 100%;
      }
    }
  }
}
</style>
