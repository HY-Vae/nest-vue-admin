<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑任务' : '新增任务'"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="任务名称" prop="jobName">
        <el-input
          v-model.trim="formData.jobName"
          placeholder="请输入任务名称"
          clearable
          maxlength="64"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="任务组名" prop="jobGroup">
        <el-input
          v-model.trim="formData.jobGroup"
          placeholder="请输入任务组名"
          clearable
          maxlength="64"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="调用目标" prop="invokeTarget">
        <el-input
          v-model.trim="formData.invokeTarget"
          placeholder="格式: service.method(args)"
          clearable
          maxlength="255"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="cron表达式" prop="cronExpression">
        <el-input
          v-model.trim="formData.cronExpression"
          placeholder="如: 0 0 2 * * ?"
          clearable
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="执行策略" prop="misfirePolicy">
        <el-select
          v-model="formData.misfirePolicy"
          placeholder="请选择执行策略"
          clearable
          filterable
        >
          <el-option
            v-for="dict in misfirePolicyOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="是否并发" prop="concurrent">
        <el-select
          v-model="formData.concurrent"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="dict in concurrentOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="!isEdit" label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in jobStatusOptions"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model.trim="formData.remark"
          type="textarea"
          placeholder="请输入备注"
          maxlength="255"
          show-word-limit
          :rows="3"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem } from '@/types/global.ts'
import { computed, reactive, ref, watch } from 'vue'
import { createJobApi, updateJobApi } from './service'
import type { CreateJobType, JobListType, UpdateJobType } from './job.type'
import type { FormInstance, FormRules } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  editData?: JobListType | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'success'): void
}>()

const { getDictOptions } = useDict()

const jobStatusOptions = ref<SelectOptionItem[]>([])
const misfirePolicyOptions = ref<SelectOptionItem[]>([])
const concurrentOptions = ref<SelectOptionItem[]>([])

getDictOptions('jobStatus').then((res) => { jobStatusOptions.value = res })
getDictOptions('jobMisfirePolicy').then((res) => { misfirePolicyOptions.value = res })
getDictOptions('jobConcurrent').then((res) => { concurrentOptions.value = res })

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => !!props.editData?.id)

const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const initFormData = () => ({
  jobName: '',
  jobGroup: '',
  invokeTarget: '',
  cronExpression: '',
  misfirePolicy: '1',
  concurrent: '1',
  status: '0',
  remark: '',
})

const formData = reactive<CreateJobType>(initFormData())

const rules = reactive<FormRules>({
  jobName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  jobGroup: [{ required: true, message: '请输入任务组名', trigger: 'blur' }],
  invokeTarget: [{ required: true, message: '请输入调用目标', trigger: 'blur' }],
  cronExpression: [{ required: true, message: '请输入cron表达式', trigger: 'blur' }],
})

watch(
  () => props.editData,
  (val) => {
    if (val) {
      Object.assign(formData, {
        jobName: val.jobName,
        jobGroup: val.jobGroup,
        invokeTarget: val.invokeTarget,
        cronExpression: val.cronExpression,
        misfirePolicy: val.misfirePolicy,
        concurrent: val.concurrent,
        remark: val.remark || '',
      })
    } else {
      Object.assign(formData, initFormData())
    }
  },
  { immediate: true },
)

const handleClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, initFormData())
  visible.value = false
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  submitLoading.value = true

  try {
    if (isEdit.value) {
      const updateData: UpdateJobType = { ...formData }
      await updateJobApi(props.editData!.id, updateData)
      ElMessage.success('编辑成功')
    } else {
      await createJobApi(formData)
      ElMessage.success('新增成功')
    }
    emit('success')
    handleClose()
  } finally {
    submitLoading.value = false
  }
}
</script>
