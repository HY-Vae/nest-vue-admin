<script setup lang="ts">
import { Location } from '@element-plus/icons-vue'
import Icon from '@/components/icon/icon.vue'
const props = defineProps({
  menu: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <template v-if="menu.children?.length">
    <el-sub-menu :index="menu.name" v-if="!menu.hidden">
      <template #title>
        <!--        <el-icon><location /></el-icon>-->
        <Icon :icon="menu.meta.icon" v-if="menu.meta.icon" :size="20" class="mr-[4px]!" />
        <span class="">{{ menu.meta?.title }}</span>
      </template>
      <side-menu-item v-for="item in menu.children" :key="item.id" :menu="item" />
    </el-sub-menu>
  </template>
  <template v-else>
    <el-menu-item :index="menu.name" v-if="!menu.hidden">
      <Icon :icon="menu.meta.icon" v-if="menu.meta.icon" :size="20" class="mr-[4px]!" />
      {{ menu.meta?.title }}
    </el-menu-item>
  </template>
</template>

<style scoped></style>
