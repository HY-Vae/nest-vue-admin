<script setup lang="ts">
import { ref, type PropType, computed, watch } from 'vue'
import { ActionEnum } from '@/enums/common.ts'
import type { FormInstance } from 'element-plus'
import type { CreateDictType, DictListType } from '@/views/sys/dict/dict.type'
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
    type: Object as PropType<DictListType>,
  },
})
const visible = defineModel<boolean>({ required: true })
const emits = defineEmits(['cancel', 'confirm'])
const dictFormRef = ref<FormInstance>()

const { getDictOptions } = useDict()

const enableStatusOptions = ref<SelectOptionItem[]>([])

const formLabelWidth = '100px'
const dictForm = ref<CreateDictType>({
  name: '',
  code: '',
  sort: 0,
  status: '',
  remark: '',
})

const rules = {
  name: [
    { required: true, message: '请输入字典名称', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  code: [
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
  dictFormRef.value?.validate((valid) => {
    if (valid) {
      emits('confirm', dictForm.value)
    }
  })
}

const closeDialog = () => {
  dictFormRef.value?.resetFields()
  dictForm.value = {
    name: '',
    code: '',
    sort: 0,
    status: '',
    remark: '',
  }
}

const openDialog = () => {
  getDictOptions('enableStatus').then((res) => {
    enableStatusOptions.value = res
  })
}

const title = computed(() => {
  return props.action === ActionEnum.Add ? '添加字典' : '编辑字典'
})

watch(
  () => props.current,
  (val) => {
    if (val != undefined && !props.detailLoading) {
      dictForm.value = val
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
    <el-form :model="dictForm" ref="dictFormRef" v-loading="detailLoading" :rules="rules">
      <el-form-item label="字典名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="dictForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="字典值" :label-width="formLabelWidth" prop="code">
        <el-input v-model="dictForm.code" autocomplete="off" />
      </el-form-item>
      <el-form-item label="字典状态" :label-width="formLabelWidth" prop="status">
        <el-select v-model="dictForm.status" placeholder="请选择字典状态">
          <el-option
            v-for="item in enableStatusOptions"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
        <el-input-number
          v-model="dictForm.sort"
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
          v-model="dictForm.remark"
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
