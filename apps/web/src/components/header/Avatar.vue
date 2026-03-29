<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.ts'
import { ArrowDown } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

const avatarStr = computed(() => {
  if (currentUser.value?.nickName) {
    return currentUser.value.nickName.charAt(0).toUpperCase()
  }
  return 'N'
})
</script>

<template>
  <div class="flex items-center">
    <el-avatar
      v-if="currentUser?.avatar"
      :src="currentUser.avatar"
      :size="40"
      class="user-avatar"
    />
    <el-avatar v-else :size="40" class="user-avatar avatar-placeholder">
      {{ avatarStr }}
    </el-avatar>
    <div class="flex items-center ml-2">
      <span class="user-name">
        {{ currentUser?.nickName }}
      </span>
      <el-icon class="el-icon--right" :size="16"><arrow-down /></el-icon>
    </div>
  </div>
</template>

<style scoped>
.user-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  background-color: #409eff;
  color: #fff;
  font-weight: bold;
}

.user-name {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
