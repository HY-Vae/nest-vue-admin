<script setup lang="ts">
import Avatar from '@/components/header/Avatar.vue'
import LayoutSwitcher from '@/components/header/LayoutSwitcher.vue'
import NoticeIcon from '@/components/header/NoticeIcon.vue'
import { useLockStore } from '@/stores/modules/lock'
import { presetColors, useThemeStore } from '@/stores/modules/theme'
import { useUserStore } from '@/stores/modules/user'
import { Moon, Sunny, Check, User, Lock } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

defineProps<{
  /** 横向/混合模式顶部栏中的 actions 使用深色风格 */
  dark?: boolean
}>()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const lockStore = useLockStore()
const { isDark } = storeToRefs(themeStore)

const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      return
    case 'layout':
      await userStore.logout()
      router.push(`/auth/login?redirect=${route.fullPath}`)
      return
  }
}
</script>

<template>
  <div class="header-actions" :class="{ 'is-dark': dark }">
    <!-- 主题切换 -->
    <div class="theme-switch-wrapper">
      <el-icon class="theme-icon" :class="{ active: !isDark }">
        <Sunny />
      </el-icon>
      <el-switch
        :model-value="isDark"
        size="small"
        @change="themeStore.toggleDark"
      />
      <el-icon class="theme-icon" :class="{ active: isDark }">
        <Moon />
      </el-icon>
    </div>

    <!-- 主题色选择 -->
    <el-dropdown trigger="click">
      <el-button circle>
        <span class="color-dot" :style="{ backgroundColor: themeStore.primaryColor }"></span>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <div class="color-picker">
            <el-tooltip
              v-for="item in presetColors"
              :key="item.color"
              :content="item.name"
              placement="top"
            >
              <span
                :class="['color-item', { active: themeStore.primaryColor === item.color }]"
                :style="{ backgroundColor: item.color }"
                @click="themeStore.setPrimaryColor(item.color)"
              >
                <el-icon v-if="themeStore.primaryColor === item.color"><Check /></el-icon>
              </span>
            </el-tooltip>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 布局切换 -->
    <LayoutSwitcher />

    <!-- 通知图标 -->
    <NoticeIcon />

    <!-- 锁屏 -->
    <el-tooltip content="锁屏" placement="bottom">
      <el-button circle @click="lockStore.lock()">
        <el-icon :size="16"><Lock /></el-icon>
      </el-button>
    </el-tooltip>

    <el-dropdown @command="handleCommand">
      <avatar />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">
            <el-icon><User /></el-icon>
            个人中心
          </el-dropdown-item>
          <el-dropdown-item divided command="layout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;

  :deep(.el-button.is-circle) {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .theme-switch-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 20px;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.06);
    }

    .theme-icon {
      font-size: 16px;
      color: var(--el-text-color-secondary);
      transition: color 0.3s;

      &.active {
        color: var(--el-color-primary);
      }
    }
  }

  .color-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: block;
    transition: transform 0.2s;
  }

  // 深色版本（用于顶部导航栏）
  &.is-dark {
    :deep(.el-button.is-circle) {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.85);

      &:hover {
        background: rgba(255, 255, 255, 0.18);
        border-color: rgba(255, 255, 255, 0.25);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
    }

    .theme-switch-wrapper {
      background: rgba(255, 255, 255, 0.08);

      &:hover {
        background: rgba(255, 255, 255, 0.12);
      }

      .theme-icon {
        color: rgba(255, 255, 255, 0.5);

        &.active {
          color: #ffffff;
        }
      }

      :deep(.el-switch) {
        --el-switch-off-color: rgba(255, 255, 255, 0.2);
      }
    }

    .color-dot {
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
}
</style>

<style lang="scss">
.color-picker {
  display: flex;
  gap: 8px;
  padding: 8px 12px;

  .color-item {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent;

    &:hover {
      transform: scale(1.15);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    &.active {
      border-color: var(--el-text-color-primary);
      transform: scale(1.1);
    }

    .el-icon {
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
