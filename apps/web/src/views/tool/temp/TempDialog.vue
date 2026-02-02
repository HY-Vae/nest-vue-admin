<script setup lang="ts">
import { ActionEnum } from '@/enums/common'
import type { FormInstance } from 'element-plus'
import { computed, ref, watch, type PropType } from 'vue'
import type { CreateTempType, TempListType } from './temp.type'
const props = defineProps({
  action: {
    type: String as PropType<ActionEnum>,
    default: ActionEnum.Add,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  detailLoading: {
    type: Boolean,
    default: false,
  },
  current: {
    required: false,
    type: Object as PropType<TempListType>,
  },
})
const visible = defineModel<boolean>({ required: true })
const emits = defineEmits(['cancel', 'confirm'])
const tempFormRef = ref<FormInstance>()

const formLabelWidth = '100px'
const tempForm = ref<CreateTempType>({
  name: '',
  code: '',
  tempPath: '',
})

const rules = {
  name: [
    { required: true, message: '请输入模板名称', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  code: [
    { required: true, message: '请输入模板值', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  tempPath: [{ required: true, message: '请输入模板路径', trigger: 'blur' }],
}
const cancel = () => {
  visible.value = false
  emits('cancel')
}
const confirm = () => {
  tempFormRef.value?.validate((valid) => {
    if (valid) {
      emits('confirm', tempForm.value)
    }
  })
}

const closeDialog = () => {
  tempFormRef.value?.resetFields()
  tempForm.value = {
    name: '',
    code: '',
    tempPath: '',
  }
}

const openDialog = () => {}

const title = computed(() => {
  // const base = props.action === ActionEnum.Add ? '添加模板' : '编辑模板'
  return `在服务端对应模板路径创建一个模块包`
})

const changeTempPath = () => {
  if (tempForm.value.tempPath) {
    const temps = tempForm.value.tempPath.split('/')
    tempForm.value.code = temps[temps.length - 1] || ''
  }
}

watch(
  () => props.current,
  (val) => {
    if (val != undefined && !props.detailLoading) {
      tempForm.value = val
    }
  },
)
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="closeDialog"
    @open="openDialog"
  >
    <el-form :model="tempForm" ref="tempFormRef" v-loading="detailLoading" :rules="rules">
      <el-form-item label="模板名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="tempForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="模板Code" :label-width="formLabelWidth" prop="code">
        <el-input v-model="tempForm.code" autocomplete="off" />
      </el-form-item>
      <el-form-item label="模板路径" :label-width="formLabelWidth" prop="tempPath">
        <el-input v-model="tempForm.tempPath" @blur="changeTempPath" placeholder="请输入模板路径" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm" :loading="loading"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
