<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useThemeStore } from '@/stores/modules/theme'
import { ref } from 'vue'
import { RouterView } from 'vue-router'

// 初始化主题，确保所有页面（包括登录页）都能读取到主题色变量
useThemeStore()

const size = ref<'large' | 'default' | 'small'>('default')
const zIndex = ref(3000)
</script>

<template>
  <el-config-provider :size="size" :z-index="zIndex" :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>
