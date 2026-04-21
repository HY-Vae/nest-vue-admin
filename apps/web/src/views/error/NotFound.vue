<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="error-page">
    <div class="error-page__content">
      <div class="error-page__shadow">404</div>
      <h1 class="error-page__title">404</h1>
      <p class="error-page__desc">抱歉，您访问的页面不存在</p>
      <div class="error-page__actions">
        <el-button @click="goBack">返回上页</el-button>
        <el-button type="primary" @click="goHome">回到首页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--el-bg-color);
  overflow: hidden;
}

.error-page__content {
  position: relative;
  text-align: center;
}

.error-page__title {
  font-size: 140px;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: float 3s ease-in-out infinite;
}

.error-page__shadow {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  font-size: 140px;
  font-weight: 800;
  line-height: 1;
  color: transparent;
  text-shadow: 0 30px 40px var(--el-color-primary-light-7);
  opacity: 0.6;
  z-index: -1;
  animation: float 3s ease-in-out infinite;
}

.error-page__desc {
  margin-top: 16px;
  font-size: 18px;
  color: var(--el-text-color-secondary);
}

.error-page__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

.error-page__shadow {
  animation: float-shadow 3s ease-in-out infinite;
}

@keyframes float-shadow {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateX(-50%) translateY(4px);
    opacity: 0.3;
  }
}
</style>
