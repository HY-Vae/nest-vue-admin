<script setup lang="ts">
import Avatar from '@/components/header/Avatar.vue'
import router from '@/router'
import { presetColors, useThemeStore } from '@/stores/modules/theme'
import { useUserStore } from '@/stores/modules/user.ts'
import { Moon, Sunny, Check } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userStore = useUserStore()
const themeStore = useThemeStore()

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
    <div class="header-actions">
      <!-- 暗黑模式切换 -->
      <el-tooltip :content="themeStore.isDark ? '浅色模式' : '暗黑模式'" placement="bottom">
        <el-button
          :icon="themeStore.isDark ? Sunny : Moon"
          circle
          @click="themeStore.toggleDark"
        />
      </el-tooltip>

      <!-- 主题色选择 -->
      <el-dropdown trigger="click">
        <el-button circle>
          <span
            class="color-dot"
            :style="{ backgroundColor: themeStore.primaryColor }"
          />
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
                  <el-icon v-if="themeStore.primaryColor === item.color"><check /></el-icon>
                </span>
              </el-tooltip>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown @command="handleCommadn">
        <avatar />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="layout">退出登录</el-dropdown-item>
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
  padding: 0 16px;
  height: 50px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
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
