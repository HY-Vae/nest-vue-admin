<script setup lang="ts">
import { CircleCheckFilled, CircleClose } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 布局模式: label=带标签列(弹窗), icon=图标前缀(登录页) */
    layout?: 'label' | 'icon'
    /** 预填旧密码 */
    defaultOldPassword?: string
  }>(),
  { layout: 'label', defaultOldPassword: '' },
)

const formRef = ref<FormInstance>()

const form = reactive({
  oldPassword: props.defaultOldPassword,
  newPassword: '',
  confirmPassword: '',
})

// 预填旧密码变化时同步
watch(
  () => props.defaultOldPassword,
  (val) => {
    form.oldPassword = val
  },
)

const isLabel = computed(() => props.layout === 'label')

const rules: FormRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'change' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/,
      message: '密码必须包含字母和数字',
      trigger: 'change',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule: unknown, value: string, callback: (err?: Error) => void) => {
        if (value !== form.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 密码强度检测
const passwordChecks = computed(() => {
  const pwd = form.newPassword
  return [
    { label: '至少6个字符', passed: pwd.length >= 6 },
    { label: '包含字母', passed: /[A-Za-z]/.test(pwd) },
    { label: '包含数字', passed: /\d/.test(pwd) },
    { label: '包含特殊字符', passed: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pwd) },
  ]
})

const passwordStrength = computed(() => {
  const passedCount = passwordChecks.value.filter((c) => c.passed).length
  if (passedCount <= 1) return { level: 0, text: '弱', color: '#F56C6C' }
  if (passedCount === 2) return { level: 1, text: '较弱', color: '#E6A23C' }
  if (passedCount === 3) return { level: 2, text: '中等', color: '#409EFF' }
  return { level: 3, text: '强', color: '#67C23A' }
})

/** 校验表单，成功返回表单数据 */
async function validate(): Promise<{ oldPassword: string; newPassword: string }> {
  await formRef.value?.validate()
  return { oldPassword: form.oldPassword, newPassword: form.newPassword }
}

/** 重置表单 */
function resetFields() {
  formRef.value?.resetFields()
}

defineExpose({ validate, resetFields })
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-width="isLabel ? '80px' : '90px'"
    size="large"
    class="change-password-form"
  >
    <!-- 旧密码 -->
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="form.oldPassword"
        type="password"
        placeholder="请输入旧密码"
        show-password
        clearable
      >
        <template v-if="!isLabel" #prefix>
          <el-icon><i-ep-lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <!-- 新密码（含强度指示器） -->
    <el-form-item label="新密码" prop="newPassword">
      <el-popover
        :visible="!!form.newPassword"
        placement="right"
        :width="240"
        :show-arrow="true"
        :offset="8"
      >
        <template #reference>
          <el-input
            v-model="form.newPassword"
            type="password"
            placeholder="6-20位，需包含字母和数字"
            show-password
            clearable
          >
            <template v-if="!isLabel" #prefix>
              <el-icon><i-ep-lock /></el-icon>
            </template>
          </el-input>
        </template>
        <div class="password-strength">
          <div class="strength-bar">
            <div
              v-for="i in 4"
              :key="i"
              class="strength-segment"
              :style="{ backgroundColor: i <= passwordStrength.level + 1 ? passwordStrength.color : '' }"
            />
          </div>
          <span class="strength-text" :style="{ color: passwordStrength.color }">
            {{ passwordStrength.text }}
          </span>
        </div>
        <div class="password-checks">
          <div
            v-for="item in passwordChecks"
            :key="item.label"
            class="check-item"
            :class="{ passed: item.passed }"
          >
            <el-icon :size="14">
              <component :is="item.passed ? 'CircleCheckFilled' : 'CircleClose'" />
            </el-icon>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </el-popover>
    </el-form-item>

    <!-- 确认密码 -->
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        type="password"
        placeholder="请再次输入新密码"
        show-password
        clearable
      >
        <template v-if="!isLabel" #prefix>
          <el-icon><i-ep-lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.password-strength {
  display: flex;
  align-items: center;
  gap: 8px;

  .strength-bar {
    display: flex;
    gap: 4px;
    flex: 1;

    .strength-segment {
      height: 4px;
      flex: 1;
      border-radius: 2px;
      background-color: var(--el-border-color-light);
      transition: background-color 0.3s;
    }
  }

  .strength-text {
    font-size: 12px;
    min-width: 28px;
    text-align: right;
  }
}

.password-checks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 16px;
  margin-top: 10px;

  .check-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    transition: color 0.3s;

    &.passed {
      color: var(--el-color-success);
    }
  }
}
</style>
