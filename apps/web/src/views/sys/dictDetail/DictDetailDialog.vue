<script setup lang="ts">
import { ActionEnum } from '@/enums/common.ts'
import type {
  CreateDictDetailType,
  DictDetailListType,
} from '@/views/sys/dictDetail/dictDetail.type'
import type { FormInstance } from 'element-plus'
import { computed, ref, watch, type PropType } from 'vue'

import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem } from '@/types/global.ts'

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
    type: Object as PropType<DictDetailListType>,
  },
})
const { getDictOptions } = useDict()

const enableStatusOptions = ref<SelectOptionItem[]>([])
getDictOptions('enableStatus').then((res) => {
  enableStatusOptions.value = res
})

const visible = defineModel<boolean>({ required: true })
const emits = defineEmits(['cancel', 'confirm'])
const dictDetailFormRef = ref<FormInstance>()

const formLabelWidth = '100px'
const dictDetailForm = ref<CreateDictDetailType>({
  label: '',
  value: '',
  sort: 0,
  status: '0',
  remark: '',
  sysDictCode: '',
})

const rules = {
  label: [
    { required: true, message: '请输入字典名称', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  value: [
    { required: true, message: '请输入字典值', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  status: [{ required: true, message: '请选择字典状态', trigger: 'blur' }],
  remark: [{ max: 255, message: '长度不能超过255个字符', trigger: 'change' }],
}
const cancel = () => {
  visible.value = false
  emits('cancel')
}
const confirm = () => {
  dictDetailFormRef.value?.validate((valid) => {
    if (valid) {
      emits('confirm', dictDetailForm.value)
    }
  })
}

const closeDialog = () => {
  dictDetailFormRef.value?.resetFields()
  dictDetailForm.value = {
    label: '',
    value: '',
    sort: 0,
    status: '0',
    remark: '',
    sysDictCode: '',
  }
}

const title = computed(() => {
  return props.action === ActionEnum.Add ? '添加字典' : '编辑字典'
})

watch(
  () => props.current,
  (val) => {
    if (val != undefined && !props.detailLoading) {
      dictDetailForm.value = {
        ...val,
        sysDictCode: dictDetailForm.value.sysDictCode,
      }
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
  >
    <el-form
      :model="dictDetailForm"
      ref="dictDetailFormRef"
      v-loading="detailLoading"
      :rules="rules"
    >
      <el-form-item label="字典名称" :label-width="formLabelWidth" prop="label">
        <el-input v-model="dictDetailForm.label" autocomplete="off" />
      </el-form-item>
      <el-form-item label="字典值" :label-width="formLabelWidth" prop="value">
        <el-input v-model="dictDetailForm.value" autocomplete="off" />
      </el-form-item>
      <el-form-item label="字典状态" :label-width="formLabelWidth" prop="status">
        <el-switch
          v-model="dictDetailForm.status"
          active-value="0"
          inactive-value="1"
          active-text="启用"
          inactive-text="停用"
          inline-prompt
        />
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
        <el-input-number
          v-model="dictDetailForm.sort"
          :min="0"
          controls-position="right"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
        <el-input
          type="textarea"
          maxlength="255"
          show-word-limit
          :autosize="{ minRows: 3, maxRows: 5 }"
          v-model="dictDetailForm.remark"
          autocomplete="off"
          word-limit-position="outside"
        />
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
