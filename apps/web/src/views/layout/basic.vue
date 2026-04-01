<script setup lang="ts">
import TabsView from '@/components/tabs/TabsView.vue'
import TheHeader from '@/components/header/TheHeader.vue'
import SideMenu from '@/components/sideMenu/index.vue'
import { useTabsStore } from '@/stores/modules/tabs'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tabsStore = useTabsStore()

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
    <div class="aside">
      <div class="logo">
        <img src="@/assets/logo.svg" alt="logo" class="logo-img" />
        <span class="logo-text">Admin</span>
      </div>
      <side-menu />
    </div>
    <div class="main">
      <the-header />
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

    .logo {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-shrink: 0;

      .logo-img {
        width: 28px;
        height: 28px;
      }

      .logo-text {
        font-size: 18px;
        font-weight: 600;
        color: var(--el-color-primary);
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
