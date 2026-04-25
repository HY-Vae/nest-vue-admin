<script setup lang="ts">
import { verifyPasswordApi } from '@/api/auth.ts'
import { useLockStore } from '@/stores/modules/lock.ts'
import { useUserStore } from '@/stores/modules/user.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const lockStore = useLockStore()
const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

const password = ref('')
const loading = ref(false)

const avatarStr = currentUser.value?.nickName?.charAt(0).toUpperCase() || 'N'

const handleUnlock = async () => {
  if (!password.value) return
  loading.value = true
  try {
    await verifyPasswordApi(password.value)
    lockStore.unlock()
  } catch {
    // 错误已由拦截器提示
  } finally {
    loading.value = false
    password.value = ''
  }
}

const handleLogout = async () => {
  await userStore.logout()
  window.location.reload()
}
</script>

<template>
  <transition name="lock-fade">
    <div v-if="lockStore.isLocked" class="lock-screen">
      <div class="lock-content">
        <el-avatar :size="80" class="lock-avatar">
          <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="avatar" />
          <span v-else class="lock-avatar-text">{{ avatarStr }}</span>
        </el-avatar>
        <h2 class="lock-name">{{ currentUser?.nickName || '用户' }}</h2>
        <p class="lock-hint">屏幕已锁定，请输入密码解锁</p>
        <el-input
          v-model="password"
          type="password"
          placeholder="请输入登录密码"
          class="lock-input"
          size="large"
          show-password
          @keyup.enter="handleUnlock"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
        <el-button
          type="primary"
          size="large"
          class="lock-btn"
          :loading="loading"
          @click="handleUnlock"
        >
          解锁
        </el-button>
        <div class="lock-footer">
          <el-button type="info" link @click="handleLogout">退出登录</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Lock } from '@element-plus/icons-vue'
export default { components: { Lock } }
</script>

<style scoped>
.lock-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);
}

.lock-content {
  text-align: center;
  width: 320px;
}

.lock-avatar {
  background-color: var(--el-color-primary);
}

.lock-avatar-text {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
}

.lock-name {
  margin-top: 16px;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.lock-hint {
  margin-top: 8px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.lock-input {
  margin-top: 24px;
}

.lock-btn {
  margin-top: 16px;
  width: 100%;
}

.lock-footer {
  margin-top: 16px;
}

.lock-fade-enter-active,
.lock-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lock-fade-enter-from,
.lock-fade-leave-to {
  opacity: 0;
}
</style>
