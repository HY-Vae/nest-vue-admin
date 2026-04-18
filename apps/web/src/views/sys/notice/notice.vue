<script setup lang="ts">
import { transTime } from '@/utils/util.ts'
import { ActionEnum } from '@/enums/common.ts'
import NoticeDialog from './NoticeDialog.vue'
import type { CreateNoticeType, NoticeListType, QueryNoticeType } from './notice.type'
import { useRequest } from 'vue-request'
import { reactive, ref } from 'vue'
import {
  deleteNoticeApi,
  getNoticeApi,
  addNoticeApi,
  updateNoticeApi,
} from './service'
import { useSearchParams } from '@/composables/useSearchParams'

const searchlabelWith = ref(80)

const searchSpan = ref({
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 4,
})

// 初始搜索条件
const initialSearchForm: QueryNoticeType = {
  title: undefined,
  type: undefined,
  status: undefined,
  current: 1,
  pageSize: 20,
}

const searchForm = reactive({ ...initialSearchForm })

// 搜索条件保存恢复
const { reset: resetSearchParams } = useSearchParams(searchForm)

const typeOptions = [
  { label: '公告', value: 'notice' },
  { label: '警告', value: 'warning' },
]

const onSearch = () => {
  searchForm.current = 1
  runQuery()
}

const onReset = () => {
  resetSearchParams(initialSearchForm)
  runQuery()
}

const tableData = ref<NoticeListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runQuery } = useRequest(
  () => getNoticeApi({ ...searchForm }),
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
  runQuery()
}

const handleCurrentChange = () => {
  runQuery()
}

// 弹窗相关
const dialogVisible = ref(false)
const dialogAction = ref<ActionEnum>(ActionEnum.Add)
const currentNotice = ref<NoticeListType | undefined>()

const handleAdd = () => {
  dialogAction.value = ActionEnum.Add
  currentNotice.value = undefined
  dialogVisible.value = true
}

const handleEdit = (row: NoticeListType) => {
  dialogAction.value = ActionEnum.Edit
  currentNotice.value = { ...row }
  dialogVisible.value = true
}

// 删除
const { runAsync: runDeleteNotice } = useRequest(deleteNoticeApi, {
  manual: true,
  loadingKeep: 500,
})

const handleDelete = (row: NoticeListType) => {
  ElMessageBox.confirm(`确定要删除通知「${row.title}」吗？`, '提示', {
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteNotice(row.id)
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
    runQuery()
  })
}

// 提交表单
const { loading: dialogLoading, run: handleConfirm } = useRequest(
  (data: CreateNoticeType) => {
    if (dialogAction.value === ActionEnum.Add) {
      return addNoticeApi(data)
    }
    return updateNoticeApi({ ...data, id: currentNotice.value!.id })
  },
  {
    loadingKeep: 500,
    onSuccess: () => {
      ElMessage.success(dialogAction.value === ActionEnum.Add ? '新增成功' : '更新成功')
      dialogVisible.value = false
      runQuery()
    },
  },
)
</script>

<template>
  <div class="page-container notice-container">
    <el-card class="search-bar">
      <el-form :model="searchForm" :label-width="searchlabelWith" @keydown.enter="onSearch" @submit.prevent>
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="标题" prop="title">
              <el-input
                v-model.trim="searchForm.title"
                placeholder="请输入标题"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item label="类型" prop="type">
              <el-select
                v-model="searchForm.type"
                placeholder="请选择类型"
                clearable
                style="width: 200px"
              >
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="searchForm.status"
                placeholder="请选择状态"
                clearable
                style="width: 200px"
              >
                <el-option label="正常" value="0" />
                <el-option label="关闭" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item>
              <el-button type="primary" plain @click="onSearch">搜索</el-button>
              <el-button plain @click="onReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button type="primary" @click="handleAdd" v-auth="'sys:notice:create'">新增</el-button>
      </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table :data="tableData" border row-key="id">
          <el-table-column label="标题" align="center" prop="title" />
          <el-table-column label="类型" align="center" prop="type" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.type === 'notice' ? 'primary' : 'warning'">
                {{ scope.row.type === 'notice' ? '公告' : '警告' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '0' ? 'success' : 'info'">
                {{ scope.row.status === '0' ? '正常' : '关闭' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" width="180">
            <template #default="scope">
              <span>{{ transTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template #default="scope">
              <el-button type="primary" link @click="handleEdit(scope.row)" v-auth="'sys:notice:update'">
                编辑
              </el-button>
              <el-button type="danger" link @click="handleDelete(scope.row)" v-auth="'sys:notice:remove'">
                删除
              </el-button>
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
          v-model:current-page="searchForm.current"
          v-model:page-size="searchForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>

    <NoticeDialog
      v-model="dialogVisible"
      :action="dialogAction"
      :current="currentNotice"
      :loading="dialogLoading"
      @confirm="handleConfirm"
    />
  </div>
</template>

<style scoped lang="scss">
.notice-container {
}
</style>
