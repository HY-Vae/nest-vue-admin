<script setup lang="ts">
import Avatar from '@/components/header/Avatar.vue'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import NoticeIcon from '@/components/header/NoticeIcon.vue'
import { useLockStore } from '@/stores/modules/lock'
import { presetColors, useThemeStore } from '@/stores/modules/theme'
import { useUserStore } from '@/stores/modules/user.ts'
import { Moon, Sunny, Check, Fold, Expand, User, Lock } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const lockStore = useLockStore()
const { isCollapse, isDark } = storeToRefs(themeStore)

const handleCommadn = async (command: string) => {
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
  <header class="header">
    <div class="header-left">
      <el-icon class="collapse-icon" @click="themeStore.toggleCollapse">
        <Fold v-if="!isCollapse" />
        <Expand v-else />
      </el-icon>
      <Breadcrumb style="margin-left: 12px" />
    </div>

    <div class="header-actions">
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

      <!-- 通知图标 -->
      <NoticeIcon />

      <!-- 锁屏 -->
      <el-tooltip content="锁屏" placement="bottom">
        <el-button circle @click="lockStore.lock()">
          <el-icon :size="16"><Lock /></el-icon>
        </el-button>
      </el-tooltip>

      <el-dropdown @command="handleCommadn">
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
  </header>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 50px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .header-left {
    display: flex;
    align-items: center;

    .collapse-icon {
      font-size: 20px;
      cursor: pointer;
      color: var(--el-text-color-regular);
      transition: color 0.2s;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .theme-switch-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background-color: var(--el-fill-color-light);
    border-radius: 20px;

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
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    border: 2px solid transparent;

    &:hover {
      transform: scale(1.1);
    }

    &.active {
      border-color: var(--el-text-color-primary);
    }

    .el-icon {
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
