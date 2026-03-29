<script setup lang="ts">
import Avatar from '@/components/header/Avatar.vue'
import router from '@/router'
import { useUserStore } from '@/stores/modules/user.ts'
import { useRoute } from 'vue-router'

const route = useRoute()
const userStore = useUserStore()

const handleCommadn = (command: string) => {
  switch (command) {
    case 'layout':
      userStore.logout()
      const fullPath = route.fullPath
      router.push(`/auth/login?redirect=${fullPath}`)
      return
  }
}
</script>

<template>
  <header class="header justify-end">
    <el-dropdown style="margin-right: 30px" @command="handleCommadn">
      <avatar />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="layout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </header>
</template>

<style scoped></style>
