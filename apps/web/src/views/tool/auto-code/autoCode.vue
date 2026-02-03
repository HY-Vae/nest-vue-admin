<template>
  <div class="page-container">
    <el-card class="search-bar">
      <el-form :model="searchAutoCodeForm" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="模块code" prop="name">
              <el-input
                v-model="searchAutoCodeForm.name"
                placeholder="请输入模块code"
                clearable
                style="width: 200px"
                @keyup.enter="onAutoCodeSearch"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="模块中文名称" prop="nameZh">
              <el-input
                v-model="searchAutoCodeForm.nameZh"
                placeholder="请输入模块中文名称"
                clearable
                style="width: 200px"
                @keyup.enter="onAutoCodeSearch"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="模板目录" prop="tempId">
              <el-input
                v-model="searchAutoCodeForm.tempId"
                placeholder="请输入模板目录"
                clearable
                style="width: 200px"
                @keyup.enter="onAutoCodeSearch"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item>
              <el-button type="primary" plain @click="onAutoCodeSearch">搜索</el-button>
              <el-button plain @click="onAutoCodeReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button
          type="primary"
          :icon="Plus"
          v-auth="['tool:auto-code:create']"
          @click="addAutoCode"
          >新增</el-button
        >
        <el-button
          type="danger"
          :icon="Delete"
          v-auth="['tool:auto-code:removes']"
          :disabled="!selectedAutoCodeIds.length"
          @click="delAutoCodes(DeleteEnum.Multiple)"
        >
          批量删除
        </el-button>
      </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table :data="tableData" border row-key="id" @selection-change="autoCodeSelectionChange">
          <el-table-column type="selection" width="55" align="center" />

          <el-table-column label="模块code" align="center" prop="name" />

          <el-table-column label="模块中文名称" align="center" prop="nameZh" />

          <el-table-column label="Prisma 表名" align="center" prop="modelName" />

          <el-table-column label="Web目录" align="center" prop="webPath" />

          <el-table-column label="模板目录" align="center" prop="tempId" />

          <el-table-column label="路由地址" align="center" prop="routePath" />

          <el-table-column label="创建人" align="center" prop="createBy" />

          <el-table-column label="创建时间" align="center" width="180">
            <template #default="scope">
              <span>{{ transTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="110">
            <template #default="scope">
              <el-button
                type="primary"
                v-auth="['tool:auto-code:update']"
                link
                @click="updateAutoCode(scope.row)"
                >修改</el-button
              >
              <el-button
                type="danger"
                v-auth="['tool:auto-code:remove']"
                link
                @click="delAutoCodes(DeleteEnum.Single, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <template #empty>
            <el-empty :image-size="200" />
          </template>
        </el-table>
      </div>
      <el-row justify="end">
        <el-pagination
          class="table-pagination"
          v-model:current-page="searchAutoCodeForm.current"
          v-model:page-size="searchAutoCodeForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <autoCode-dialog
      :action="action"
      :loading="actionLoading"
      :detailLoading="detailLoading"
      :current="currentAutoCode"
      v-model="visible"
      @cancel="cancelDialog"
      @confirm="runActionAutoCode"
    />
  </div>
</template>
<script setup lang="ts">
import { ActionEnum, DeleteEnum } from '@/enums/common.ts'
import { transTime } from '@/utils/util.ts'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRequest } from 'vue-request'
import type { AutoCodeListType, CreateAutoCodeType, UpdateAutoCodeType } from './autoCode.type'
import AutoCodeDialog from './AutoCodeDialog.vue'
import {
  addAutoCodeApi,
  deleteAutoCodesApi,
  getAutoCodeApi,
  getAutoCodeOneApi,
  updateAutoCodeApi,
} from './service'

const searchSpan = ref({
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 4,
})

const searchAutoCodeForm = ref({
  name: undefined,
  nameZh: undefined,
  tempId: undefined,
  current: 1,
  pageSize: 20,
})

const onAutoCodeSearch = () => {
  searchAutoCodeForm.value.current = 1
  runGetAutoCode()
}

const onAutoCodeReset = () => {
  searchAutoCodeForm.value = {
    name: undefined,
    nameZh: undefined,
    tempId: undefined,
    current: 1,
    pageSize: 20,
  }
  runGetAutoCode()
}

const tableData = ref<AutoCodeListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runGetAutoCode } = useRequest(
  () => {
    return getAutoCodeApi({
      ...searchAutoCodeForm.value,
    })
  },
  {
    manual: false,
    loadingKeep: 500,
    onSuccess: (res) => {
      tableData.value = res.data.list
      total.value = res.data.total
    },
  },
)

const handleSizeChange = () => {
  runGetAutoCode()
}

const handleCurrentChange = () => {
  runGetAutoCode()
}

const visible = ref<boolean>(false)
const action = ref<ActionEnum>(ActionEnum.Add)

const addAutoCode = () => {
  action.value = ActionEnum.Add
  currentAutoCode.value = undefined
  visible.value = true
}

const cancelDialog = () => {}

const { loading: actionLoading, run: runActionAutoCode } = useRequest(
  (values: CreateAutoCodeType | UpdateAutoCodeType) => {
    if (action.value === ActionEnum.Add) {
      return addAutoCodeApi(values as CreateAutoCodeType)
    }
    return updateAutoCodeApi(values as UpdateAutoCodeType)
  },
  {
    loadingKeep: 500,
    onSuccess: (res) => {
      visible.value = false
      const message = action.value === ActionEnum.Add ? '新增生成列表成功' : '修改生成列表成功'
      ElMessage.success(message)
    },
  },
)
const currentAutoCode = ref<AutoCodeListType | undefined>(undefined)
const { loading: detailLoading, run: runGetAutoCodeOne } = useRequest(getAutoCodeOneApi, {
  loadingKeep: 500,
  onSuccess: (res) => {
    currentAutoCode.value = res.data
  },
})

const updateAutoCode = (row: AutoCodeListType) => {
  action.value = ActionEnum.Edit
  visible.value = true
  runGetAutoCodeOne(row.id)
}

const { runAsync: runDeleteAutoCodes } = useRequest(deleteAutoCodesApi, {
  loadingKeep: 500,
})

const delAutoCodes = (action: DeleteEnum, row?: AutoCodeListType) => {
  let message = '此操作将永久删除该生成列表, 是否继续?'
  let ids: string[] = []
  if (action === DeleteEnum.Single && row != undefined) {
    ids = [row.id]
  }
  if (action === DeleteEnum.Multiple) {
    message = `此操作将永久批量删除当前${selectedAutoCodeIds.value.length}个生成列表, 是否继续?`
    ids = selectedAutoCodeIds.value
  }
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteAutoCodes(ids)
          .then(() => {
            selectedAutoCodeIds.value = []
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            done()
          })
          .catch(() => {
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
          })
      } else {
        done()
      }
    },
  }).then(() => {
    ElMessage.success('删除成功')
    runGetAutoCode()
  })
}

const selectedAutoCodeIds = ref<string[]>([])
const autoCodeSelectionChange = (autoCodes: AutoCodeListType[]) => {
  selectedAutoCodeIds.value = autoCodes.map((autoCode) => autoCode.id)
}
</script>
<style scoped lang="scss">
.page-container {
}
</style>
