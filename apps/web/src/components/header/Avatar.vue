<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.ts'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

const avaratarStr = computed(() => {
  if (currentUser.value?.nickName) {
    return currentUser.value.nickName.charAt(0).toUpperCase()
  }
  return 'N'
})
</script>

<template>
  <div class="flex items-center">
    <div
      class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold"
    >
      {{ avaratarStr }}
    </div>
    <div class="flex items-center ml-2">
      <span>
        {{ currentUser?.nickName }}
      </span>
      <el-icon class="el-icon--right" :size="16"><arrow-down /></el-icon>
    </div>
  </div>
</template>

<style scoped></style>
