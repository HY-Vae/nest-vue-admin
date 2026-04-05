<script setup lang="ts">
import { ActionEnum } from '@/enums/common.ts'
import type { FormInstance } from 'element-plus'
import { computed, ref, watch, type PropType } from 'vue'
import type { CreateSysDeptType, SysDeptListType } from './sysDept.type'

import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem, SelectTreeItem } from '@/types/global.ts'

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
  deptTree: {
    type: Array as PropType<SysDeptListType[]>,
    default: () => [],
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
  parentId: null,
  phone: '',
  email: '',
  sort: 0,
  status: '1',
  remark: '',
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
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
  email: [
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
    },
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
    parentId: null,
    phone: '',
    email: '',
    sort: 0,
    status: '1',
    remark: '',
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

// 转换部门树为选择器数据
const deptTreeOptions = computed<SelectTreeItem[]>(() => {
  const transform = (list: SysDeptListType[]): SelectTreeItem[] => {
    return list.map((item) => ({
      value: item.id,
      label: item.deptName,
      children: item.children ? transform(item.children) : [],
    }))
  }
  return [{ value: '', label: '顶级部门' }, ...transform(props.deptTree)]
})

watch(
  () => props.current,
  (val) => {
    if (val != undefined && !props.detailLoading) {
      sysDeptForm.value = { ...val }
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
    <el-form
      :model="sysDeptForm"
      ref="sysDeptFormRef"
      v-loading="detailLoading"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-row :gutter="18">
        <el-col :span="rowSpan">
          <el-form-item label="上级部门" prop="parentId">
            <el-tree-select
              v-model="sysDeptForm.parentId"
              :data="deptTreeOptions"
              placeholder="请选择上级部门"
              check-strictly
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="sysDeptForm.deptName" placeholder="请输入部门名称" clearable maxlength="30" show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="部门编码" prop="deptCode">
            <el-input v-model="sysDeptForm.deptCode" placeholder="请输入部门编码" clearable maxlength="20" show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="sysDeptForm.phone" placeholder="请输入联系电话" clearable maxlength="11" />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="sysDeptForm.email" placeholder="请输入邮箱" clearable maxlength="50" />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="sysDeptForm.sort" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="启用状态" prop="status">
            <el-select v-model="sysDeptForm.status" style="width: 100%">
              <el-option
                v-for="dict in enableStatusOptions"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="sysDeptForm.remark"
              type="textarea"
              placeholder="请输入备注"
              :rows="3"
              maxlength="255"
              show-word-limit
            />
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
