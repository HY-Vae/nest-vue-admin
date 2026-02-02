<script setup lang="ts">
import { ref, type PropType, computed, watch } from 'vue'
import { ActionEnum } from '@/enums/common'
import type { FormInstance, UploadInstance } from 'element-plus'
import type { CreateFileUploadType, FileUploadListType } from './fileUpload.type'
import { UploadFilled } from '@element-plus/icons-vue'
import { UPLOAD_API } from '@/constants/constant.ts'

const props = defineProps({
  action: {
    type: String as PropType<ActionEnum>,
    default: ActionEnum.Add,
  },
  detailLoading: {
    type: Boolean,
    default: false,
  },
  current: {
    required: false,
    type: Object as PropType<FileUploadListType>,
  },
})

const loading = ref(false)
const uploadRef = ref<UploadInstance>()
const visible = defineModel<boolean>({ required: true })
const emits = defineEmits(['cancel', 'confirm'])

const cancel = () => {
  visible.value = false
  emits('cancel')
}

const confirm = () => {
  loading.value = true
  uploadRef.value?.submit()
}

const closeDialog = () => {
  uploadRef.value?.clearFiles()
}

const openDialog = () => {}

const title = computed(() => {
  return props.action === ActionEnum.Add ? '添加附件上传' : '编辑附件上传'
})

const headers = computed(() => {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
})

const uploadSuccess = () => {
  ElMessage.success('上传成功')
  loading.value = false
  emits('confirm')
}
const uploadError = () => {
  ElMessage.error('上传失败')
  loading.value = false
}
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
    <el-upload
      class="upload-demo"
      drag
      ref="uploadRef"
      :loading="loading"
      :action="UPLOAD_API"
      :headers="headers"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :auto-upload="false"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm" :loading="loading"> 确认上传 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
