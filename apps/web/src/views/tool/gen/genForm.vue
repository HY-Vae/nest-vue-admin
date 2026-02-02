<script setup lang="ts">
import { camelCase, cloneDeep, snakeCase } from 'lodash-es'
import { computed, type PropType, reactive, ref } from 'vue'
import {
  baseFieldForm,
  fieldBasic,
  fieldTypeOptions,
  searchTypeOptions,
} from '@/views/tool/gen/constant.ts'
import type { SelectOptionItem } from '@/types/global.ts'
import type { BaseFieldType } from '@/views/tool/gen/gen.type'
import { FieldTypeEnum, GenTypeEnum } from '@/enums/gen.enum.ts'
import type { CheckboxValueType } from 'element-plus'
import { filterShowType } from '@/views/tool/gen/util.ts'

const visible = defineModel<boolean>({ required: true })
const props = defineProps({
  dictTypeOptions: {
    type: Array as PropType<SelectOptionItem[]>,
    default: () => [],
  },
  action: {
    type: String,
    required: true,
  },
  current: {
    type: Object as PropType<BaseFieldType>,
    required: false,
  },
})

const emits = defineEmits(['cancel', 'confirm'])
const fieldForm = ref<BaseFieldType>(cloneDeep(baseFieldForm))

const rules = ref({
  nameCh: [
    {
      required: true,
      message: '请输入字段中文名',
      trigger: 'blur',
    },
  ],
  name: [
    {
      required: true,
      message: '请输入字段Code',
      trigger: 'blur',
    },
  ],
  nameJson: [
    {
      required: true,
      message: '请输入字段JSON',
      trigger: 'blur',
    },
  ],
  dataName: [
    {
      required: true,
      message: '请输入字段数据库字段名',
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: '请选择表单类型',
      trigger: 'change',
    },
  ],
  formItemType: [
    {
      required: true,
      message: '请选择显示类型',
      trigger: 'change',
    },
  ],
})

const autoInput = () => {
  fieldForm.value.nameJson = camelCase(fieldForm.value.name)
  fieldForm.value.dataName = snakeCase(fieldForm.value.name)
}

const changeNames = () => {
  if (fieldForm.value.nameJson || fieldForm.value.dataName) {
    return
  }
  autoInput()
}

const changeType = () => {
  const basic = fieldBasic[fieldForm.value.type]
  fieldForm.value = {
    ...fieldForm.value,
    ...basic,
    formItemType: showTypeOptions.value[0]?.value as GenTypeEnum,
  }
}

const changeDict = (dictCode: string) => {
  const isIn = showTypeOptions.value.find((item) => item.value === dictCode)
  if (!isIn) {
    fieldForm.value.formItemType = GenTypeEnum.SELECT
  }
}

const changeAutoIncrement = (isIncrement: CheckboxValueType) => {
  if (!isIncrement) {
    fieldForm.value.defaultValue = ''
    return
  }
  fieldForm.value.defaultValue = 'autoincrement()'
}

const changePrimary = (isPrimary: string | number | boolean) => {
  if (!isPrimary) {
    fieldForm.value.isAutoIncrement = false
    fieldForm.value.defaultValue = ''
    return
  }
  if (fieldForm.value.type === 'Int') {
    fieldForm.value.isAutoIncrement = true
    changeAutoIncrement(true)
  }
}

const showTypeOptions = computed(() => {
  const options = filterShowType(fieldForm.value.type)
  if (!fieldForm.value.dictCode) {
    return options
  }
  // 如果是字典表需要再次过滤下
  return filterShowType(FieldTypeEnum.BOOLEAN)
})

const addOk = () => {
  emits('confirm', fieldForm.value)
}
const addCancel = () => {
  visible.value = false
}
const openDialog = () => {
  if (props.current) {
    fieldForm.value = props.current
  }
}

const closedDialog = () => {
  fieldForm.value = cloneDeep(baseFieldForm)
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="字段配置"
    width="1200"
    @open="openDialog"
    @closed="closedDialog"
  >
    <el-form :model="fieldForm" label-position="top" :rules="rules">
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="字段中文名" prop="nameCh">
            <el-input v-model="fieldForm.nameCh" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="字段Code" prop="name">
            <el-input
              v-model="fieldForm.name"
              autocomplete="off"
              @blur="changeNames"
              style="width: 180px"
            />
            <el-button @click="autoInput">自动填充</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="字段JSON" prop="nameJson">
            <el-input v-model="fieldForm.nameJson" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据库字段名" prop="dataName">
            <el-input v-model="fieldForm.dataName" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-form-item label="字段类型" prop="type">
          <el-radio-group v-model="fieldForm.type" @change="changeType">
            <el-radio v-for="item in fieldTypeOptions" :value="item.value" :key="item.value">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="默认值">
            <el-input v-model="fieldForm.defaultValue" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Prisma其它配置">
            <el-input v-model="fieldForm.prismaOther" />
          </el-form-item>
        </el-col>
        <template v-if="fieldForm.type === 'String' || fieldForm.type === 'Int'">
          <el-col :span="6">
            <el-form-item label="是否主键">
              <el-switch v-model="fieldForm.isPrimary" @change="changePrimary" />
              <el-checkbox
                v-if="fieldForm.type === 'Int' && fieldForm.isPrimary"
                @change="changeAutoIncrement"
                v-model="fieldForm.isAutoIncrement"
                style="margin-left: 12px"
              >
                是否自增
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否唯一">
              <el-switch v-model="fieldForm.isUnique" />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-row :gutter="12">
        <template v-if="fieldForm.type === 'String'">
          <el-col :span="6">
            <el-form-item label="字段长度" prop="size">
              <el-input-number v-model="fieldForm.size" :min="1" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关联字典表" prop="dictCode">
              <el-select v-model="fieldForm.dictCode" clearable @change="changeDict">
                <el-option
                  v-for="item in dictTypeOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </template>
        <template v-if="fieldForm.decimal && fieldForm.type === 'Decimal'">
          <el-col :span="6">
            <el-form-item label="precision" prop="decimal.precision">
              <el-input-number v-model="fieldForm.decimal.precision" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="scale" prop="decimal.scale">
              <el-input-number v-model="fieldForm.decimal.scale" controls-position="right" />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="字段类型转换">
            <el-switch v-model="fieldForm.isTranslate" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="查询条件">
            <el-select v-model="fieldForm.searchType">
              <el-option
                v-for="item in searchTypeOptions"
                :value="item.value"
                :key="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="显示类型" prop="formItemType">
            <el-select v-model="fieldForm.formItemType">
              <el-option
                v-for="item in showTypeOptions"
                :value="item.value"
                :key="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="4">
          <el-form-item label="是否必填">
            <el-switch v-model="fieldForm.isRequired" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="前端新增/编辑">
            <el-switch v-model="fieldForm.isAdd" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否查询">
            <el-switch v-model="fieldForm.isSearch" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否列表显示">
            <el-switch v-model="fieldForm.isShowTable" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addCancel">取消</el-button>
        <el-button type="primary" @click="addOk"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
