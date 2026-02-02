<script setup lang="ts">
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
import SideMenu from '@/components/sideMenu/index.vue'
import TheHeader from '@/components/header/TheHeader.vue'
</script>

<template>
  <div class="nva-container">
    <div class="aside">
      <side-menu />
    </div>
    <div class="main">
      <the-header />
      <div class="content">
        <div class="router-view">
          <router-view />
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
  }
  .main {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
      height: 50px;
      display: flex;
      align-items: center;
      padding-left: 20px;
    }
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
