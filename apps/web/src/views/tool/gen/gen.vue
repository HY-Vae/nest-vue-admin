<template>
  <div class="page-container">
    <el-card class="search-bar">
      <div class="flex justify-between mb-2">
        <p>结构配置</p>
        <div>
          <el-button @click="generateWebCode">生成前端代码</el-button>
          <el-button type="primary" plain @click="generateCode">生成代码</el-button>
        </div>
      </div>
      <el-form :model="generateForm" ref="genFormRef" :rules="rules">
        <el-row :gutter="12">
          <el-col :span="4">
            <el-form-item label="模块中文" prop="nameZh">
              <el-input v-model="generateForm.nameZh" placeholder="请输入模块名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Prisma表名" prop="modelName">
              <el-input
                v-model="generateForm.modelName"
                placeholder="首字母会自动转为大写"
                @blur="changeModelName"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="模块Code" prop="name">
              <el-input v-model="generateForm.name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="tempId">
              <template #label>
                <span>
                  <el-tooltip content="生成服务的目录，默认在src下面" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  模板目录
                </span>
              </template>
              <!--            <el-input-->
              <!--              v-model="generateForm.serverPath"-->
              <!--              placeholder="默认在src下面"-->
              <!--              @blur="changeServerPath"-->
              <!--              clearable-->
              <!--            />-->
              <el-select v-model="generateForm.tempId" @change="changeTempId" clearable>
                <el-option
                  v-for="item in tempOptions"
                  :value="item.id"
                  :key="item.id"
                  :label="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="webPath">
              <template #label>
                <span>
                  <el-tooltip content="生成前端代码的目录，默认在src/views下面" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  web目录
                </span>
              </template>
              <el-input
                v-model="generateForm.webPath"
                placeholder="默认在src/views下面"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="routePath">
              <template #label>
                <span>
                  <el-tooltip content="服务的访问路径" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由地址
                </span>
              </template>
              <el-input v-model="generateForm.routePath" placeholder="eg: sys/user" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button @click="addField" type="primary" :icon="Plus">新增字段</el-button>
      </el-row>
      <div class="table-main">
        <FieldTable
          :fieldsTableData="fieldsTableData"
          :dictTypeOptions="dictTypeOptions"
          @update="handleUpdate"
          @delete="handleDelete"
          @copy="handleCopy"
        />
      </div>
    </el-card>
    <gen-form
      v-model="fieldDialogVisible"
      :action="action"
      :current="current"
      :dictTypeOptions="dictTypeOptions"
      @confirm="addFieldOk"
    />
  </div>
</template>

<script lang="ts" setup>
import { paramCase, pascalCase } from 'change-case'
import FieldTable from './FieldTable.vue'
import { baseFieldsTable } from '@/views/tool/gen/constant'
import { getDictOptionsApi } from '@/views/system/dict/service'
import { getTempOptionsApi } from '@/views/tool/temp/service'
import { reactive, ref, watch, onMounted } from 'vue'
import { Plus, QuestionFilled } from '@element-plus/icons-vue'
import GenForm from '@/views/tool/gen/genForm.vue'
import { insertCode, insertCodeWeb } from '@/views/tool/gen/service.ts'
import type { SelectOptionItem } from '@/types/global.ts'
import type { BaseFieldType } from '@/views/tool/gen/gen.type'
import type { FormInstance } from 'element-plus'
import type { TempListType } from '@/views/tool/temp/temp.type'

const fieldDialogVisible = ref<boolean>(false)

const dictTypeOptions = ref<SelectOptionItem[]>([])
const getDictTypeOptions = async () => {
  const res = await getDictOptionsApi()
  dictTypeOptions.value = res.data
}
getDictTypeOptions()

const tempOptions = ref<TempListType[]>([])
const getTempOptions = () => {
  getTempOptionsApi().then((res) => {
    tempOptions.value = res.data
  })
}
getTempOptions()

const generateForm = ref({
  name: '',
  nameZh: '',
  modelName: '',
  // serverPath: 'modules/vehicle',
  webPath: '',
  tempId: '',
  routePath: '',
})
const genFormRef = ref<FormInstance>()
const rules = reactive({
  nameZh: [{ required: true, message: '请输入模块中文', trigger: 'blur' }],
  modelName: [{ required: true, message: '请输入Prisma表名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入模块Code', trigger: 'blur' }],
  tempId: [{ required: true, message: '请选择模板', trigger: 'blur' }],
  webPath: [{ required: true, message: '请输入web目录', trigger: 'blur' }],
  routePath: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
})

const changeModelName = () => {
  generateForm.value.modelName = pascalCase(generateForm.value.modelName)
  generateForm.value.name = paramCase(generateForm.value.modelName)
}

const changeTempId = (id: string) => {
  const target = tempOptions.value.find((item) => item.id === id)
  if (target) {
    generateForm.value.webPath = `${target.code}/${generateForm.value.name}`
    generateForm.value.routePath = `${target.code}/${generateForm.value.name}`
  }
}

const fieldsTableData = ref(baseFieldsTable)

const action = ref('add')
const updateIndex = ref(-1)
const current = ref<BaseFieldType | undefined>(undefined)
const addField = () => {
  action.value = 'add'
  fieldDialogVisible.value = true
  current.value = undefined
}
const addIndex = ref<number>(1)
const addFieldOk = (values: BaseFieldType) => {
  if (action.value === 'add') {
    fieldsTableData.value.splice(addIndex.value, 0, values)
    addIndex.value++
  } else {
    fieldsTableData.value.splice(updateIndex.value, 1, values)
  }
  fieldDialogVisible.value = false
}

const handleUpdate = (row: BaseFieldType, index: number) => {
  action.value = 'update'
  updateIndex.value = index
  current.value = JSON.parse(JSON.stringify(row))
  fieldDialogVisible.value = true
}

const handleCopy = (row: BaseFieldType) => {
  action.value = 'add'
  current.value = JSON.parse(JSON.stringify(row))
  fieldDialogVisible.value = true
}

const setLocal = () => {
  const body = {
    ...generateForm.value,
    addIndex: addIndex.value,
    fields: fieldsTableData.value,
  }
  localStorage.setItem('genCode', JSON.stringify(body))
}
const generateCode = () => {
  genFormRef.value?.validate((valid) => {
    if (valid) {
      const body = {
        ...generateForm.value,
        addIndex: addIndex.value,
        fields: fieldsTableData.value,
      }
      insertCode(body).then((res) => {
        console.log(res)
      })
    }
  })
}

const generateWebCode = () => {
  genFormRef.value?.validate((valid) => {
    if (valid) {
      const body = {
        ...generateForm.value,
        addIndex: addIndex.value,
        fields: fieldsTableData.value,
      }
      insertCodeWeb(body).then((res) => {
        console.log(res)
      })
    }
  })
}

/** 删除按钮操作 */
function handleDelete(index: number) {
  if (addIndex.value > 1) {
    addIndex.value--
  }
  fieldsTableData.value.splice(index, 1)
  ElMessage.success('删除成功')
}
watch(
  [fieldsTableData, generateForm],
  () => {
    setLocal()
  },
  {
    deep: true,
  },
)
onMounted(() => {
  const genCode = localStorage.getItem('genCode')
  if (genCode) {
    const body = JSON.parse(genCode)
    const { fields, addIndex: idx, ...other } = body
    fieldsTableData.value = fields
    generateForm.value = other
    addIndex.value = idx || 1
  }
})
</script>
