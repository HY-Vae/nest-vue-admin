<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const size = ref('default')
const zIndex = ref(3000)
</script>

<template>
  <el-config-provider :size="size" :z-index="zIndex" :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>
