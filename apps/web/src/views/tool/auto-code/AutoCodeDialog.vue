<script setup lang="ts">
import { ref, type PropType, computed, watch } from 'vue'
import { ActionEnum } from '@/enums/common'
import type { FormInstance } from 'element-plus'
import type { CreateAutoCodeType, AutoCodeListType } from './autoCode.type'

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
    type: Object as PropType<AutoCodeListType>,
  },
})

const rowSpan = ref(24)
const visible = defineModel<boolean>({ required: true })
const emits = defineEmits(['cancel', 'confirm'])
const autoCodeFormRef = ref<FormInstance>()

const formLabelWidth = '100px'
const autoCodeForm = ref<CreateAutoCodeType>({
  name: undefined,
  nameZh: undefined,
  modelName: undefined,
  webPath: undefined,
  tempId: undefined,
  routePath: undefined,
  fields: undefined,
})

const rules = {
  name: [
    { required: true, message: '模块code不能为空', trigger: 'blur' },
    { max: 50, message: '不能超过50个字符', trigger: 'change' },
  ],
  nameZh: [
    { required: true, message: '模块中文名称不能为空', trigger: 'blur' },
    { max: 50, message: '不能超过50个字符', trigger: 'change' },
  ],
  modelName: [
    { required: true, message: 'Prisma 表名不能为空', trigger: 'blur' },
    { max: 50, message: '不能超过50个字符', trigger: 'change' },
  ],
  webPath: [
    { required: true, message: 'Web目录不能为空', trigger: 'blur' },
    { max: 50, message: '不能超过50个字符', trigger: 'change' },
  ],
  tempId: [
    { required: true, message: '模板目录不能为空', trigger: 'blur' },
    { max: 36, message: '不能超过36个字符', trigger: 'change' },
  ],
  routePath: [
    { required: true, message: '路由地址不能为空', trigger: 'blur' },
    { max: 50, message: '不能超过50个字符', trigger: 'change' },
  ],
  fields: [
    { required: true, message: '字段列表不能为空', trigger: 'blur' },
    { max: 0, message: '不能超过0个字符', trigger: 'change' },
  ],
}
const cancel = () => {
  visible.value = false
  emits('cancel')
}
const confirm = () => {
  autoCodeFormRef.value?.validate((valid) => {
    if (valid) {
      emits('confirm', autoCodeForm.value)
    }
  })
}

const closeDialog = () => {
  autoCodeFormRef.value?.resetFields()
  autoCodeForm.value = {
    name: undefined,
    nameZh: undefined,
    modelName: undefined,
    webPath: undefined,
    tempId: undefined,
    routePath: undefined,
    fields: undefined,
  }
}

const openDialog = () => {}

const title = computed(() => {
  return props.action === ActionEnum.Add ? '添加生成列表' : '编辑生成列表'
})

watch(
  () => props.current,
  (val) => {
    if (val != undefined && !props.detailLoading) {
      autoCodeForm.value = val
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
    <el-form :model="autoCodeForm" ref="autoCodeFormRef" v-loading="detailLoading" :rules="rules">
      <el-row :gutter="18">
        <el-col :span="rowSpan">
          <el-form-item label="模块code" prop="name">
            <el-input v-model="autoCodeForm.name" placeholder="请输入模块code" />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="模块中文名称" prop="nameZh">
            <el-input v-model="autoCodeForm.nameZh" placeholder="请输入模块中文名称" />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="Prisma 表名" prop="modelName">
            <el-input v-model="autoCodeForm.modelName" placeholder="请输入Prisma 表名" />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="Web目录" prop="webPath">
            <el-input v-model="autoCodeForm.webPath" placeholder="请输入Web目录" />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="模板目录" prop="tempId">
            <el-input v-model="autoCodeForm.tempId" placeholder="请输入模板目录" />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="路由地址" prop="routePath">
            <el-input v-model="autoCodeForm.routePath" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>

        <el-col :span="rowSpan">
          <el-form-item label="字段列表" prop="fields">
            <el-input
              v-model="autoCodeForm.fields"
              show-word-limit
              maxlength="0"
              placeholder="请输入字段列表"
              type="textarea"
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
