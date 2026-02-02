<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.ts'
import { storeToRefs } from 'pinia'
import SideMenuItem from '@/components/sideMenu/sideMenuItem.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

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
  <el-menu :default-active="activeMenu" class="h-full" @select="selectOne">
    <side-menu-item v-for="item in menus" :key="item.id" :menu="item" />
  </el-menu>
</template>

<style scoped></style>
