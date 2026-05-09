<script setup lang="ts">
import Icon from '@/components/icon/icon.vue'
import router from '@/router'

defineProps({
  menu: {
    type: Object,
    default: () => ({}),
  },
})

const selectOne = (name: string) => {
  if (name.startsWith('http')) {
    window.open(name)
    return
  }
  router.push({ name })
}
</script>

<script lang="ts">
export default { name: 'TopMenuItem' }
</script>

<template>
  <template v-if="menu.children?.length">
    <el-sub-menu :index="menu.name" v-if="!menu.hidden">
      <template #title>
        <Icon :icon="menu.meta.icon" :size="16" v-if="menu.meta.icon" style="margin-right: 4px" />
        <span>{{ menu.meta?.title }}</span>
      </template>
      <top-menu-item v-for="item in menu.children" :key="item.id" :menu="item" />
    </el-sub-menu>
  </template>
  <template v-else>
    <el-menu-item :index="menu.name" v-if="!menu.hidden" @click="selectOne(menu.name)">
      <Icon :icon="menu.meta.icon" :size="16" v-if="menu.meta.icon" style="margin-right: 4px" />
      <template #title>
        <span>{{ menu.meta?.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>
