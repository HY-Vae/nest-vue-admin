<script setup lang="ts">
import { getCaptchaApi, loginApi } from '@/api/auth.ts'
import router from '@/router'
import type { FormInstance, FormRules } from 'element-plus'
import { debounce } from 'lodash-es'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const ruleFormRef = ref<FormInstance>()
const route = useRoute()

const loginForm = reactive({
  userName: '',
  password: '',
  captcha: '',
})

const rules = reactive<FormRules<typeof loginForm>>({
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

const loading = ref(false)

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await loginApi({
        ...loginForm,
        captchaId: captchaInfo.value.id,
      })
      localStorage.setItem('token', res.data.token)
      ElMessage.success('登录成功')
      if (!res.data.home) {
        ElMessage.error('当前用户没有配置菜单权限，请联系管理员')
      }
      const redirect = route.query.redirect
      if (redirect) {
        router.push(redirect as string)
        return
      }
      router.push(res.data.home)
    } catch {
      refreshCaptcha()
    } finally {
      loading.value = false
    }
  })
}

const captchaInfo = ref({ id: '', img: '' })

const getCaptcha = async () => {
  const res = await getCaptchaApi(captchaInfo.value.id)
  captchaInfo.value = res.data
}

const refreshCaptcha = debounce(() => {
  captchaInfo.value.id = ''
  captchaInfo.value.img = ''
  getCaptcha()
}, 300)
getCaptcha()
</script>

<template>
  <div class="login-page">
    <!-- 左侧装饰区 -->
    <div class="login-banner">
      <div class="banner-content">
        <h1 class="banner-title">NVA</h1>
        <p class="banner-desc">Nest-Vue-Admin</p>
        <p class="banner-sub">高效、灵活的企业级后台管理解决方案</p>
        <div class="banner-features">
          <div class="feature-item">
            <span class="feature-dot" />
            <span>RBAC 权限管控</span>
          </div>
          <div class="feature-item">
            <span class="feature-dot" />
            <span>动态路由菜单</span>
          </div>
          <div class="feature-item">
            <span class="feature-dot" />
            <span>代码自动生成</span>
          </div>
        </div>
      </div>
      <!-- 装饰圆 -->
      <div class="deco deco-1" />
      <div class="deco deco-2" />
      <div class="deco deco-3" />
    </div>

    <!-- 右侧表单区 -->
    <div class="login-main">
      <div class="login-card">
        <h2 class="form-title">欢迎回来</h2>
        <p class="form-subtitle">请登录您的账号</p>

        <el-form
          ref="ruleFormRef"
          :model="loginForm"
          :rules="rules"
          size="large"
          class="login-form"
          @keyup.enter="submitForm(ruleFormRef)"
        >
          <el-form-item prop="userName">
            <el-input
              v-model="loginForm.userName"
              placeholder="请输入用户名"
              clearable
            >
              <template #prefix>
                <el-icon><i-ep-user /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              clearable
            >
              <template #prefix>
                <el-icon><i-ep-lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="captcha">
            <div class="captcha-row">
              <el-input
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
                clearable
              >
                <template #prefix>
                  <el-icon><i-ep-key /></el-icon>
                </template>
              </el-input>
              <div class="captcha-img" title="点击刷新" @click="refreshCaptcha">
                <div v-html="captchaInfo.img" />
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="login-btn"
              :loading="loading"
              @click="submitForm(ruleFormRef)"
            >
              {{ loading ? '登录中...' : '登 录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100%;
  display: flex;
}

/* ===== 左侧装饰 ===== */
.login-banner {
  position: relative;
  width: 45%;
  flex-shrink: 0;
  background: linear-gradient(160deg, var(--el-color-primary) 0%, var(--el-color-primary-dark-2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 60px;

  .banner-content {
    position: relative;
    z-index: 1;
    color: #fff;
  }

  .banner-title {
    font-size: 56px;
    font-weight: 800;
    letter-spacing: 8px;
    margin: 0;
    line-height: 1;
  }

  .banner-desc {
    font-size: 20px;
    font-weight: 500;
    margin: 12px 0 0;
    opacity: 0.9;
    letter-spacing: 2px;
  }

  .banner-sub {
    font-size: 14px;
    margin: 24px 0 0;
    opacity: 0.7;
    line-height: 1.8;
    max-width: 320px;
  }

  .banner-features {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    opacity: 0.85;
  }

  .feature-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    flex-shrink: 0;
  }

  /* 装饰圆 */
  .deco {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
  }

  .deco-1 {
    width: 400px;
    height: 400px;
    top: -120px;
    right: -100px;
  }

  .deco-2 {
    width: 250px;
    height: 250px;
    bottom: -80px;
    left: -60px;
  }

  .deco-3 {
    width: 150px;
    height: 150px;
    bottom: 80px;
    right: 40px;
    background: rgba(255, 255, 255, 0.03);
  }
}

/* ===== 右侧表单 ===== */
.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-bg-color);
  padding: 40px;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin: 0;
}

.form-subtitle {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 8px 0 36px;
}

.login-form {
  :deep(.el-input__wrapper) {
    border-radius: 8px;
    padding: 4px 12px;
  }

  .el-form-item {
    margin-bottom: 22px;
  }
}

.captcha-row {
  display: flex;
  gap: 12px;
  width: 100%;

  .el-input {
    flex: 1;
  }
}

.captcha-img {
  width: 120px;
  height: 40px;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  transition: all 0.2s;

  &:hover {
    border-color: var(--el-color-primary);
    box-shadow: 0 0 0 2px var(--el-color-primary-light-8);
  }

  > div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.login-btn {
  width: 100%;
  border-radius: 8px;
  font-size: 16px;
  height: 44px;
  letter-spacing: 4px;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .login-banner {
    display: none;
  }

  .login-main {
    padding: 24px;
  }
}
</style>
