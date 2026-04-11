<template>
  <div class="page-container">
    <el-card class="search-bar">
      <el-form
        :model="searchSysDeptForm"
        class="demo-form-inline"
        @keydown.enter="onSysDeptSearch"
        @submit.prevent
      >
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="部门名称" prop="deptName">
              <el-input
                v-model="searchSysDeptForm.deptName"
                placeholder="请输入部门名称"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="部门编码" prop="deptCode">
              <el-input
                v-model="searchSysDeptForm.deptCode"
                placeholder="请输入部门编码"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="启用状态" prop="status">
              <el-select
                v-model="searchSysDeptForm.status"
                placeholder="请选择启用状态"
                clearable
                style="width: 200px"
              >
                <el-option
                  v-for="dict in enableStatusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item>
              <el-button type="primary" plain @click="onSysDeptSearch">搜索</el-button>
              <el-button plain @click="onSysDeptReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button type="primary" :icon="Plus" v-auth="'sys:dept:create'" @click="addSysDept"
          >新增</el-button
        >
      </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table
          :data="tableData"
          border
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          default-expand-all
        >
          <el-table-column label="部门名称" prop="deptName" min-width="180" />

          <el-table-column label="部门编码" align="center" prop="deptCode" width="120" />

          <el-table-column label="负责人" align="center" prop="leaderName" width="100" />

          <el-table-column label="联系电话" align="center" prop="phone" width="120" />

          <el-table-column label="排序" align="center" prop="sort" width="80" />

          <el-table-column label="启用状态" align="center" prop="status" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
                {{ getDictLabel(enableStatusOptions, scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="人数" align="center" prop="userCount" width="80" />

          <el-table-column label="创建时间" align="center" width="170">
            <template #default="scope">
              <span>{{ transTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button
                type="primary"
                v-auth="'sys:dept:create'"
                link
                @click="addChildSysDept(scope.row)"
                >新增</el-button
              >
              <el-button
                type="primary"
                v-auth="'sys:dept:update'"
                link
                @click="updateSysDept(scope.row)"
                >修改</el-button
              >
              <el-button
                type="danger"
                v-auth="'sys:dept:remove'"
                link
                @click="delSysDept(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <template #empty>
            <el-empty :image-size="200" />
          </template>
        </el-table>
      </div>
    </el-card>
    <sys-dept-dialog
      :action="action"
      :loading="actionLoading"
      :detailLoading="detailLoading"
      :current="currentSysDept"
      :deptTree="tableData"
      v-model="visible"
      @cancel="cancelDialog"
      @confirm="runActionSysDept"
    />
  </div>
</template>
<script setup lang="ts">
import { ActionEnum } from '@/enums/common.ts'
import { transTime } from '@/utils/util.ts'
import { Plus } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
import {
  addSysDeptApi,
  deleteSysDeptApi,
  getSysDeptApi,
  getSysDeptOneApi,
  updateSysDeptApi,
} from './service.ts'
import type { CreateSysDeptType, SysDeptListType, UpdateSysDeptType } from './sysDept.type'
import SysDeptDialog from './SysDeptDialog.vue'

import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem } from '@/types/global.ts'
import { useSearchParams } from '@/composables/useSearchParams'

const { getDictOptions, getDictLabel } = useDict()

const enableStatusOptions = ref<SelectOptionItem[]>([])
getDictOptions('enableStatus').then((res) => {
  enableStatusOptions.value = res
})

const searchSpan = ref({
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 4,
})

// 初始搜索条件
const initialSearchForm = {
  deptName: undefined,
  deptCode: undefined,
  status: undefined,
}

const searchSysDeptForm = reactive({ ...initialSearchForm })

// 搜索条件保存恢复
const { reset: resetSearchParams } = useSearchParams(searchSysDeptForm)

const onSysDeptSearch = () => {
  runGetSysDept()
}

const onSysDeptReset = () => {
  resetSearchParams(initialSearchForm)
  runGetSysDept()
}

const tableData = ref<SysDeptListType[]>([])

const { loading: queryLoading, run: runGetSysDept } = useRequest(
  () => {
    return getSysDeptApi({
      ...searchSysDeptForm,
    })
  },
  {
    manual: false,
    loadingKeep: 500,
    onSuccess: (res) => {
      tableData.value = res.data.list
    },
  },
)

const visible = ref<boolean>(false)
const action = ref<ActionEnum>(ActionEnum.Add)

const addSysDept = () => {
  action.value = ActionEnum.Add
  currentSysDept.value = undefined
  parentId.value = undefined
  visible.value = true
}

const addChildSysDept = (row: SysDeptListType) => {
  action.value = ActionEnum.Add
  currentSysDept.value = undefined
  parentId.value = row.id
  visible.value = true
}

const cancelDialog = () => {}

const parentId = ref<string | undefined>(undefined)

const { loading: actionLoading, run: runActionSysDept } = useRequest(
  (values: CreateSysDeptType | UpdateSysDeptType) => {
    if (action.value === ActionEnum.Add) {
      const createData = { ...values, parentId: parentId.value } as CreateSysDeptType
      return addSysDeptApi(createData)
    }
    return updateSysDeptApi(values as UpdateSysDeptType)
  },
  {
    loadingKeep: 500,
    onSuccess: () => {
      visible.value = false
      const message = action.value === ActionEnum.Add ? '新增部门成功' : '修改部门成功'
      ElMessage.success(message)
      runGetSysDept()
    },
  },
)

const currentSysDept = ref<SysDeptListType | undefined>(undefined)
const { loading: detailLoading, run: runGetSysDeptOne } = useRequest(getSysDeptOneApi, {
  loadingKeep: 500,
  onSuccess: (res) => {
    currentSysDept.value = res.data
  },
})

const updateSysDept = (row: SysDeptListType) => {
  action.value = ActionEnum.Edit
  parentId.value = undefined
  visible.value = true
  runGetSysDeptOne(row.id)
}

const { runAsync: runDeleteSysDept } = useRequest(deleteSysDeptApi, {
  loadingKeep: 500,
})

const delSysDept = (row: SysDeptListType) => {
  ElMessageBox.confirm('此操作将永久删除该部门, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteSysDept(row.id)
          .then(() => {
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
    runGetSysDept()
  })
}
</script>
<style scoped lang="scss">
.page-container {
}
</style>
