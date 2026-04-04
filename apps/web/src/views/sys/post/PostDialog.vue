<script setup lang="ts">
import { ActionEnum } from '@/enums/common.ts'
import type { FormInstance } from 'element-plus'
import { computed, ref, watch, type PropType } from 'vue'
import type { CreateSysPostType, SysPostListType } from './post.type'

import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem, SelectTreeItem } from '@/types/global.ts'
import { getDeptOptionsApi } from '@/views/sys/dept/service'

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
    type: Object as PropType<SysPostListType>,
  },
})

const { getDictOptions } = useDict()

const rowSpan = ref(24)
const visible = defineModel<boolean>({ required: true })
const emits = defineEmits(['cancel', 'confirm'])
const sysPostFormRef = ref<FormInstance>()

const formLabelWidth = '100px'
const sysPostForm = ref<CreateSysPostType>({
  name: '',
  code: '',
  deptId: null,
  isLeader: false,
  sort: 0,
  status: '0',
  remark: '',
})

const rules = {
  name: [
    { required: true, message: '岗位名称不能为空', trigger: 'blur' },
    { max: 30, message: '不能超过30个字符', trigger: 'change' },
  ],
  code: [
    { required: true, message: '岗位编码不能为空', trigger: 'blur' },
    { max: 30, message: '不能超过30个字符', trigger: 'change' },
  ],
  status: [{ required: true, message: '启用状态不能为空', trigger: 'blur' }],
}

const cancel = () => {
  visible.value = false
  emits('cancel')
}

const confirm = () => {
  sysPostFormRef.value?.validate((valid) => {
    if (valid) {
      emits('confirm', sysPostForm.value)
    }
  })
}

const closeDialog = () => {
  sysPostFormRef.value?.resetFields()
  sysPostForm.value = {
    name: '',
    code: '',
    deptId: null,
    isLeader: false,
    sort: 0,
    status: '0',
    remark: '',
  }
}

const enableStatusOptions = ref<SelectOptionItem[]>([])
const deptOptions = ref<SelectTreeItem[]>([])

const openDialog = () => {
  getDictOptions('enableStatus').then((res) => {
    enableStatusOptions.value = res
  })
  getDeptOptionsApi().then((res) => {
    deptOptions.value = [{ value: '', label: '公司通用岗位' }, ...res.data]
  })
}

const title = computed(() => {
  return props.action === ActionEnum.Add ? '添加岗位' : '编辑岗位'
})

watch(
  () => props.current,
  (val) => {
    if (val != undefined && !props.detailLoading) {
      sysPostForm.value = {
        name: val.name,
        code: val.code,
        deptId: val.deptId || null,
        isLeader: val.isLeader,
        sort: val.sort || 0,
        status: val.status,
        remark: val.remark || '',
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
    @open="openDialog"
  >
    <el-form
      :model="sysPostForm"
      ref="sysPostFormRef"
      v-loading="detailLoading"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-row :gutter="18">
        <el-col :span="rowSpan">
          <el-form-item label="所属部门" prop="deptId">
            <el-tree-select
              v-model="sysPostForm.deptId"
              :data="deptOptions"
              placeholder="请选择所属部门（不选为公司通用岗位）"
              check-strictly
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="岗位名称" prop="name">
            <el-input v-model="sysPostForm.name" placeholder="请输入岗位名称" clearable maxlength="30" show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="岗位编码" prop="code">
            <el-input v-model="sysPostForm.code" placeholder="请输入岗位编码" clearable maxlength="30" show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="负责人岗位" prop="isLeader">
            <el-switch v-model="sysPostForm.isLeader" />
            <span style="margin-left: 10px; color: #909399; font-size: 12px;">开启后，该岗位的用户将显示为部门负责人</span>
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="sysPostForm.sort" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="启用状态" prop="status">
            <el-select v-model="sysPostForm.status" style="width: 100%">
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
              v-model="sysPostForm.remark"
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
