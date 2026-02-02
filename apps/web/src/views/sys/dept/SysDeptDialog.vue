<script setup lang="ts">
import { ref, type PropType, computed, watch } from 'vue'
import { ActionEnum } from '@/enums/common.ts'
import type { FormInstance } from 'element-plus'
import type { CreateSysDeptType, SysDeptListType } from './sysDept.type.ts'

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
    type: Object as PropType<SysDeptListType>,
  },
})

const { getDictOptions } = useDict()

const rowSpan = ref(24)
const visible = defineModel<boolean>({ required: true })
const emits = defineEmits(['cancel', 'confirm'])
const sysDeptFormRef = ref<FormInstance>()

const formLabelWidth = '100px'
const sysDeptForm = ref<CreateSysDeptType>({
  deptName: '',
  deptCode: '',
  status: '',
})

const rules = {
  deptName: [
    { required: true, message: '部门名称不能为空', trigger: 'blur' },
    { max: 30, message: '不能超过30个字符', trigger: 'change' },
  ],
  deptCode: [
    { required: true, message: '部门编码不能为空', trigger: 'blur' },
    { max: 20, message: '不能超过20个字符', trigger: 'change' },
  ],
  status: [{ required: true, message: '启用状态不能为空', trigger: 'blur' }],
}
const cancel = () => {
  visible.value = false
  emits('cancel')
}
const confirm = () => {
  sysDeptFormRef.value?.validate((valid) => {
    if (valid) {
      emits('confirm', sysDeptForm.value)
    }
  })
}

const closeDialog = () => {
  sysDeptFormRef.value?.resetFields()
  sysDeptForm.value = {
    deptName: '',
    deptCode: '',
    status: '',
  }
}

const enableStatusOptions = ref<SelectOptionItem[]>([])

const openDialog = () => {
  getDictOptions('enableStatus').then((res) => {
    enableStatusOptions.value = res
  })
}

const title = computed(() => {
  return props.action === ActionEnum.Add ? '添加部门' : '编辑部门'
})

watch(
  () => props.current,
  (val) => {
    if (val != undefined && !props.detailLoading) {
      sysDeptForm.value = val
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
    <el-form :model="sysDeptForm" ref="sysDeptFormRef" v-loading="detailLoading" :rules="rules">
      <el-row :gutter="18">
        <el-col :span="rowSpan">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="sysDeptForm.deptName" placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="部门编码" prop="deptCode">
            <el-input v-model="sysDeptForm.deptCode" placeholder="请输入部门编码" />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="启用状态" prop="status">
            <el-select v-model="sysDeptForm.status">
              <el-option
                v-for="dict in enableStatusOptions"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
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
