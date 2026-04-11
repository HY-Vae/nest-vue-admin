<script setup lang="ts">
import { ActionEnum } from '@/enums/common.ts'
import type { CreateNoticeType, NoticeListType } from './notice.type'
import type { FormInstance } from 'element-plus'
import { computed, ref, watch, type PropType } from 'vue'

const props = defineProps({
  action: {
    type: String as PropType<ActionEnum>,
    default: ActionEnum.Add,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  current: {
    required: false,
    type: Object as PropType<NoticeListType>,
  },
})

const visible = defineModel<boolean>({ required: true })
const emits = defineEmits(['cancel', 'confirm'])
const formRef = ref<FormInstance>()

const formLabelWidth = '100px'
const noticeForm = ref<CreateNoticeType>({
  title: '',
  content: '',
  type: 'notice',
  status: '0',
})

const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 100, message: '长度不能超过100个字符', trigger: 'change' },
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
}

const typeOptions = [
  { label: '公告', value: 'notice' },
  { label: '警告', value: 'warning' },
]

const cancel = () => {
  visible.value = false
  emits('cancel')
}

const confirm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emits('confirm', noticeForm.value)
    }
  })
}

const closeDialog = () => {
  formRef.value?.resetFields()
  noticeForm.value = {
    title: '',
    content: '',
    type: 'notice',
    status: '0',
  }
}

const title = computed(() => {
  return props.action === ActionEnum.Add ? '新增通知' : '编辑通知'
})

watch(
  () => props.current,
  (val) => {
    if (val != undefined) {
      noticeForm.value = {
        title: val.title,
        content: val.content,
        type: val.type,
        status: val.status,
      }
    }
  },
)
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="closeDialog"
  >
    <el-form :model="noticeForm" ref="formRef" :rules="rules">
      <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
        <el-input v-model="noticeForm.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
        <el-radio-group v-model="noticeForm.type">
          <el-radio v-for="item in typeOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
        <el-switch
          v-model="noticeForm.status"
          active-value="0"
          inactive-value="1"
          active-text="正常"
          inactive-text="关闭"
          inline-prompt
        />
      </el-form-item>
      <el-form-item label="内容" :label-width="formLabelWidth" prop="content">
        <el-input
          type="textarea"
          :rows="6"
          v-model="noticeForm.content"
          placeholder="请输入内容"
          maxlength="2000"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm" :loading="loading">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
