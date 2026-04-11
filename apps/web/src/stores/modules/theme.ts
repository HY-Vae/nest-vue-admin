import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface ThemeColor {
  name: string
  color: string
}

// 内置主题色
export const presetColors: ThemeColor[] = [
  { name: '经典蓝', color: '#409eff' },
  { name: '极光绿', color: '#67c23a' },
  { name: '活力橙', color: '#e6a23c' },
  { name: '玫瑰红', color: '#f56c6c' },
  { name: '优雅紫', color: '#a855f7' },
  { name: '青瓷色', color: '#14b8a6' },
]

export const useThemeStore = defineStore(
  'theme',
  () => {
    const isDark = ref(false)
    const primaryColor = ref('#409eff')
    const isCollapse = ref(false)

    const toggleDark = () => {
      isDark.value = !isDark.value
    }

    const setPrimaryColor = (color: string) => {
      primaryColor.value = color
    }

    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value
    }

    const applyTheme = () => {
      // 应用暗黑模式
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      // 应用主题色
      document.documentElement.style.setProperty('--el-color-primary', primaryColor.value)

      // 生成主题色的浅色变体
      for (let i = 1; i <= 9; i++) {
        document.documentElement.style.setProperty(
          `--el-color-primary-light-${i}`,
          mixColor(primaryColor.value, '#ffffff', i * 0.1),
        )
      }

      // 生成主题色的深色变体
      document.documentElement.style.setProperty(
        '--el-color-primary-dark-2',
        mixColor(primaryColor.value, '#000000', 0.2),
      )
    }

    // 颜色混合函数
    const mixColor = (color1: string, color2: string, ratio: number): string => {
      const hex1 = parseInt(color1.slice(1), 16)
      const hex2 = parseInt(color2.slice(1), 16)

      const r1 = (hex1 >> 16) & 0xff
      const g1 = (hex1 >> 8) & 0xff
      const b1 = hex1 & 0xff

      const r2 = (hex2 >> 16) & 0xff
      const g2 = (hex2 >> 8) & 0xff
      const b2 = hex2 & 0xff

      const r = Math.round(r1 * (1 - ratio) + r2 * ratio)
      const g = Math.round(g1 * (1 - ratio) + g2 * ratio)
      const b = Math.round(b1 * (1 - ratio) + b2 * ratio)

      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    }

    // 监听变化自动应用
    watch([isDark, primaryColor], applyTheme, { immediate: true })

    return {
      isDark,
      primaryColor,
      isCollapse,
      presetColors,
      toggleDark,
      setPrimaryColor,
      toggleCollapse,
      applyTheme,
    }
  },
  {
    persist: {
      key: 'admin-theme',
      pick: ['isDark', 'primaryColor', 'isCollapse'],
    },
  },
)
