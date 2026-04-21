<template>
  <div class="page-container">
    <el-card class="search-bar">
      <el-form :model="searchFileUploadForm" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="文件名" prop="name">
              <el-input
                v-model.trim="searchFileUploadForm.name"
                placeholder="请输入文件名"
                clearable
                style="width: 200px"
                @keyup.enter="onFileUploadSearch"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="文件标签" prop="tag">
              <el-input
                v-model="searchFileUploadForm.tag"
                placeholder="请输入文件标签"
                clearable
                style="width: 200px"
                @keyup.enter="onFileUploadSearch"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="MIME类型" prop="mime">
              <el-input
                v-model="searchFileUploadForm.mime"
                placeholder="请输入MIME类型"
                clearable
                style="width: 200px"
                @keyup.enter="onFileUploadSearch"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item>
              <el-button type="primary" plain @click="onFileUploadSearch">搜索</el-button>
              <el-button plain @click="onFileUploadReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button
          type="primary"
          :icon="UploadFilled"
          v-auth="'upload:file:create'"
          @click="addFileUpload"
          >上传</el-button
        >
        <el-button
          type="danger"
          :icon="Delete"
          v-auth="'upload:file:removes'"
          :disabled="!selectedFileUploadIds.length"
          @click="delFileUploads(DeleteEnum.Multiple)"
        >
          批量删除
        </el-button>
      </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table
          :data="tableData"
          border
          row-key="id"
          @selection-change="fileUploadSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />

          <el-table-column label="文件名" align="center" prop="name">
            <template #default="scope">
              <el-text type="primary" class="cursor-pointer" @click="download(scope.row)">
                {{ scope.row.name }}
              </el-text>
            </template>
          </el-table-column>

          <el-table-column label="文件预览" align="center" prop="url">
            <template #default="scope">
              <el-image
                :src="scope.row.url"
                v-if="showImg(scope.row)"
                :preview-src-list="[scope.row.url]"
                preview-teleported
                class="max-w-[100px]"
                fit="cover"
              />
              <span v-else></span>
            </template>
          </el-table-column>

          <el-table-column label="文件标签" align="center" prop="tag" />

          <el-table-column label="文件大小" align="center" prop="size">
            <template #default="scope">
              <span>{{ formatBytes(scope.row.size) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="创建人" align="center" prop="createBy" />

          <el-table-column label="创建时间" align="center" width="180">
            <template #default="scope">
              <span>{{ transTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="110">
            <template #default="scope">
              <!--            <el-button-->
              <!--              type="primary"-->
              <!--              v-auth="['upload:file:download']"-->
              <!--              link-->
              <!--              @click="download(scope.row)"-->
              <!--              >下载</el-button-->
              <!--            >-->
              <el-button
                type="danger"
                v-auth="'upload:file:remove'"
                link
                @click="delFileUploads(DeleteEnum.Single, scope.row)"
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
          v-model:current-page="searchFileUploadForm.current"
          v-model:page-size="searchFileUploadForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <fileUpload-dialog
      :action="action"
      :detailLoading="detailLoading"
      :current="currentFileUpload"
      v-model="visible"
      @cancel="cancelDialog"
      @confirm="confirmDialog"
    />
  </div>
</template>
<script setup lang="ts">
import { ActionEnum, DeleteEnum } from '@/enums/common.ts'
import { transTime } from '@/utils/util.ts'
import { Delete, UploadFilled } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
import type { FileUploadListType } from './fileUpload.type'
import FileUploadDialog from './FileUploadDialog.vue'
import {
  deleteFileUploadApi,
  deleteFileUploadsApi,
  getFileUploadApi,
  getFileUploadOneApi,
} from './service'
import { useSearchParams } from '@/composables/useSearchParams'

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
  tag: undefined,
  mime: undefined,
  current: 1,
  pageSize: 20,
}

const searchFileUploadForm = reactive({ ...initialSearchForm })

// 搜索条件保存恢复
const { reset: resetSearchParams } = useSearchParams(searchFileUploadForm)

const onFileUploadSearch = () => {
  searchFileUploadForm.current = 1
  runGetFileUpload()
}

const showImg = (row: FileUploadListType) => {
  return row.mime.startsWith('image')
}

const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const onFileUploadReset = () => {
  resetSearchParams(initialSearchForm)
  runGetFileUpload()
}

const tableData = ref<FileUploadListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runGetFileUpload } = useRequest(
  () => {
    return getFileUploadApi({
      ...searchFileUploadForm,
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
  runGetFileUpload()
}

const handleCurrentChange = () => {
  runGetFileUpload()
}

const visible = ref<boolean>(false)
const action = ref<ActionEnum>(ActionEnum.Add)

const addFileUpload = () => {
  action.value = ActionEnum.Add
  currentFileUpload.value = undefined
  visible.value = true
}

const cancelDialog = () => {}

const confirmDialog = () => {
  runGetFileUpload()
  visible.value = false
}

const currentFileUpload = ref<FileUploadListType | undefined>(undefined)
const { loading: detailLoading, run: runGetFileUploadOne } = useRequest(getFileUploadOneApi, {
  loadingKeep: 500,
  onSuccess: (res) => {
    currentFileUpload.value = res.data
  },
})

const { runAsync: runDeleteFileUploads } = useRequest(
  (action: DeleteEnum, ids: string[]) => {
    if (action === DeleteEnum.Single) {
      return deleteFileUploadApi(ids[0] as string)
    }
    return deleteFileUploadsApi(ids)
  },
  {
    loadingKeep: 500,
  },
)

const download = (row: FileUploadListType) => {
  fetch(row.url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = row.name
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(blobUrl)
      link.remove()
    })
    .catch(() => {
      ElMessage.error('文件下载失败')
    })
}

const delFileUploads = (action: DeleteEnum, row?: FileUploadListType) => {
  let message = '此操作将永久删除该附件上传, 是否继续?'
  let ids: string[] = []
  if (action === DeleteEnum.Single && row != undefined) {
    ids = [row.id]
  }
  if (action === DeleteEnum.Multiple) {
    message = `此操作将永久批量删除当前${selectedFileUploadIds.value.length}个附件上传, 是否继续?`
    ids = selectedFileUploadIds.value
  }
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (act, instance, done) => {
      if (act === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteFileUploads(action, ids)
          .then(() => {
            selectedFileUploadIds.value = []
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
    runGetFileUpload()
  })
}

const selectedFileUploadIds = ref<string[]>([])
const fileUploadSelectionChange = (fileUploads: FileUploadListType[]) => {
  selectedFileUploadIds.value = fileUploads.map((fileUpload) => fileUpload.id)
}
</script>
<style scoped lang="scss">
.page-container {
}
</style>
