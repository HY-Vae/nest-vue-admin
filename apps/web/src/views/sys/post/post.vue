<template>
  <div class="page-container">
    <el-card class="search-bar">
      <el-form
        :model="searchSysPostForm"
        class="demo-form-inline"
        @keydown.enter="onSysPostSearch"
        @submit.prevent
      >
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="岗位名称" prop="name">
              <el-input
                v-model="searchSysPostForm.name"
                placeholder="请输入岗位名称"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="岗位编码" prop="code">
              <el-input
                v-model="searchSysPostForm.code"
                placeholder="请输入岗位编码"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="所属部门" prop="deptId">
              <el-tree-select
                v-model="searchSysPostForm.deptId"
                :data="deptOptions"
                placeholder="请选择所属部门"
                check-strictly
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="启用状态" prop="status">
              <el-select
                v-model="searchSysPostForm.status"
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
              <el-button type="primary" plain @click="onSysPostSearch">搜索</el-button>
              <el-button plain @click="onSysPostReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button type="primary" :icon="Plus" v-auth="'sys:post:create'" @click="addSysPost"
          >新增</el-button
        >
      </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table :data="tableData" border row-key="id">
          <el-table-column label="岗位名称" prop="name" min-width="150" />

          <el-table-column label="所属部门" align="center" width="150">
            <template #default="scope">
              <span>{{ scope.row.dept?.deptName || '公司通用' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="岗位编码" align="center" prop="code" width="150" />

          <el-table-column label="负责人岗位" align="center" prop="isLeader" width="100">
            <template #default="scope">
              <el-tag v-if="scope.row.isLeader" type="success">是</el-tag>
              <el-tag v-else type="info">否</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="排序" align="center" prop="sort" width="80" />

          <el-table-column label="启用状态" align="center" prop="status" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
                {{ getDictLabel(enableStatusOptions, scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" align="center" width="170">
            <template #default="scope">
              <span>{{ transTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button
                type="primary"
                v-auth="'sys:post:update'"
                link
                @click="updateSysPost(scope.row)"
                >修改</el-button
              >
              <el-button
                type="danger"
                v-auth="'sys:post:remove'"
                link
                @click="delSysPost(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <template #empty>
            <el-empty :image-size="200" />
          </template>
        </el-table>
      </div>
      <el-row justify="end" style="margin-top: 16px">
        <el-pagination
          v-model:current-page="searchSysPostForm.current"
          v-model:page-size="searchSysPostForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <post-dialog
      :action="action"
      :loading="actionLoading"
      :detailLoading="detailLoading"
      :current="currentSysPost"
      v-model="visible"
      @cancel="cancelDialog"
      @confirm="runActionSysPost"
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
  addSysPostApi,
  deleteSysPostApi,
  getSysPostApi,
  getSysPostOneApi,
  updateSysPostApi,
} from './service.ts'
import type { CreateSysPostType, SysPostListType, UpdateSysPostType } from './post.type'
import PostDialog from './PostDialog.vue'

import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem, SelectTreeItem } from '@/types/global.ts'
import { useSearchParams } from '@/composables/useSearchParams'
import { getDeptOptionsApi } from '@/views/sys/dept/service'

const { getDictOptions, getDictLabel } = useDict()

const enableStatusOptions = ref<SelectOptionItem[]>([])
getDictOptions('enableStatus').then((res) => {
  enableStatusOptions.value = res
})

const deptOptions = ref<SelectTreeItem[]>([])
getDeptOptionsApi().then((res) => {
  deptOptions.value = res.data
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
  name: undefined,
  code: undefined,
  deptId: undefined,
  status: undefined,
  current: 1,
  pageSize: 20,
}

const searchSysPostForm = reactive({ ...initialSearchForm })

// 搜索条件保存恢复
const { reset: resetSearchParams } = useSearchParams(searchSysPostForm)

const onSysPostSearch = () => {
  searchSysPostForm.current = 1
  runGetSysPost()
}

const onSysPostReset = () => {
  resetSearchParams(initialSearchForm)
  runGetSysPost()
}

const tableData = ref<SysPostListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runGetSysPost } = useRequest(
  () => {
    return getSysPostApi({
      ...searchSysPostForm,
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

const handleSizeChange = (val: number) => {
  searchSysPostForm.pageSize = val
  runGetSysPost()
}

const handleCurrentChange = (val: number) => {
  searchSysPostForm.current = val
  runGetSysPost()
}

const visible = ref<boolean>(false)
const action = ref<ActionEnum>(ActionEnum.Add)

const addSysPost = () => {
  action.value = ActionEnum.Add
  currentSysPost.value = undefined
  visible.value = true
}

const cancelDialog = () => {}

const { loading: actionLoading, run: runActionSysPost } = useRequest(
  (values: CreateSysPostType | UpdateSysPostType) => {
    if (action.value === ActionEnum.Add) {
      return addSysPostApi(values as CreateSysPostType)
    }
    return updateSysPostApi(values as UpdateSysPostType)
  },
  {
    loadingKeep: 500,
    onSuccess: () => {
      visible.value = false
      const message = action.value === ActionEnum.Add ? '新增岗位成功' : '修改岗位成功'
      ElMessage.success(message)
      runGetSysPost()
    },
  },
)

const currentSysPost = ref<SysPostListType | undefined>(undefined)
const { loading: detailLoading, run: runGetSysPostOne } = useRequest(getSysPostOneApi, {
  loadingKeep: 500,
  onSuccess: (res) => {
    currentSysPost.value = res.data
  },
})

const updateSysPost = (row: SysPostListType) => {
  action.value = ActionEnum.Edit
  visible.value = true
  runGetSysPostOne(row.id)
}

const { runAsync: runDeleteSysPost } = useRequest(deleteSysPostApi, {
  loadingKeep: 500,
})

const delSysPost = (row: SysPostListType) => {
  ElMessageBox.confirm('此操作将永久删除该岗位, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteSysPost(row.id)
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
    runGetSysPost()
  })
}
</script>
<style scoped lang="scss">
.page-container {
}
</style>
