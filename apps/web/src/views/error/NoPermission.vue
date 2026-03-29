<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.ts'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-50">
    <el-icon :size="80" color="#909399"><WarningFilled /></el-icon>
    <h1 class="mt-6 text-2xl font-bold text-gray-600">暂无访问权限</h1>
    <p class="mt-4 text-gray-400">您当前没有任何菜单权限，请联系管理员分配权限</p>
    <el-button type="primary" class="mt-6" @click="handleLogout">
      退出登录
    </el-button>
  </div>
</template>

<style scoped></style>
