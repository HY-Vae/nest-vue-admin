<template>
  <div class="page-container">
    <el-card class="search-bar">
      <el-form :model="searchMenuForm" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="菜单名称">
              <el-input v-model="searchMenuForm.name" placeholder="请输入菜单名称" clearable />
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item label="菜单状态">
              <el-select v-model="searchMenuForm.status" placeholder="请选择菜单状态" clearable>
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item>
              <el-button type="primary" plain @click="onMenuSearch">搜索</el-button>
              <el-button plain @click="onMenuReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button type="primary" :icon="Plus" @click="addMenu">新增</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="!selectedMenuIds.length"
          @click="delMenus(DeleteEnum.Multiple)"
        >
          批量删除
        </el-button>
      </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table :data="tableData" border row-key="id" @selection-change="menuSelectionChange">
          <el-table-column label="菜单名称">
            <template #default="scope">
              {{ scope.row.meta?.title }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="菜单值" />
          <el-table-column prop="path" label="路径" />
          <el-table-column prop="status" label="菜单状态" />
          <el-table-column prop="sort" label="排序" />
          <el-table-column prop="createBy" label="创建人" />
          <el-table-column prop="createAt" label="创建时间">
            <template #default="scope">
              {{ transTime(scope.row.createAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" link @click="addSubMenu(scope.row)">新增子菜单</el-button>
              <el-button type="primary" link @click="updateMenu(scope.row)">编辑</el-button>
              <el-button type="danger" link @click="delMenus(DeleteEnum.Single, scope.row)"
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
          v-model:current-page="searchMenuForm.current"
          v-model:page-size="searchMenuForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <menu-dialog
      :action="action"
      :menuTree="parentMenuTree"
      :parentId="parentId"
      :loading="actionLoading"
      :detailLoading="detailLoading"
      :current="currentMenu"
      v-model="visible"
      @cancel="cancelDialog"
      @confirm="runActionMenu"
    />
  </div>
</template>
<script setup lang="ts">
import { addMenuApi, deleteMenuApi, getMenuApi, getMenuOneApi, updateMenuApi } from '@/api/menu.ts'
import { ActionEnum, DeleteEnum } from '@/enums/common.ts'
import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem, SelectTreeItem } from '@/types/global.ts'
import { transTime } from '@/utils/util.ts'
import type { CreateMenuType, MenuListType, UpdateMenuType } from '@/views/sys/menu/menu.type'
import MenuDialog from '@/views/sys/menu/MenuDialog.vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'

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

const searchMenuForm = ref({
  name: '',
  status: '',
  current: 1,
  pageSize: 20,
})

const onMenuSearch = () => {
  searchMenuForm.value.current = 1
  runGetMenu()
}

const onMenuReset = () => {
  searchMenuForm.value = {
    name: '',
    status: '',
    current: 1,
    pageSize: 20,
  }
  runGetMenu()
}

const tableData = ref<MenuListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runGetMenu } = useRequest(
  () => {
    return getMenuApi({
      ...searchMenuForm.value,
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

function simplifyMenuTree(originalTree: MenuListType[]): SelectTreeItem<number>[] {
  return originalTree.map((item) => ({
    value: item.id,
    label: item.meta?.title || '',
    children: item.children && item.children.length > 0 ? simplifyMenuTree(item.children) : [],
  }))
}

const parentMenuTree = computed(() => {
  const treeList = simplifyMenuTree(tableData.value)
  return [
    {
      value: 0,
      label: '根菜单',
    },
    ...treeList,
  ]
})

const handleSizeChange = () => {
  runGetMenu()
}

const handleCurrentChange = () => {
  runGetMenu()
}

const visible = ref<boolean>(false)
const action = ref<ActionEnum>(ActionEnum.Add)
const parentId = ref(0)
const addMenu = () => {
  parentId.value = 0
  action.value = ActionEnum.Add
  currentMenu.value = undefined
  visible.value = true
}

const addSubMenu = (row: MenuListType) => {
  parentId.value = row.id
  action.value = ActionEnum.Add
  currentMenu.value = undefined
  visible.value = true
}

const cancelDialog = () => {}

const { loading: actionLoading, run: runActionMenu } = useRequest(
  (values: CreateMenuType | UpdateMenuType) => {
    if (action.value === ActionEnum.Add) {
      return addMenuApi(values as CreateMenuType)
    }
    return updateMenuApi(values as UpdateMenuType)
  },
  {
    loadingKeep: 500,
    onSuccess: (res) => {
      visible.value = false
      const message = action.value === ActionEnum.Add ? '新增菜单成功' : '修改菜单成功'
      ElMessage.success(message)
      runGetMenu()
    },
  },
)
const currentMenu = ref<MenuListType | undefined>(undefined)
const { loading: detailLoading, run: runGetMenuOne } = useRequest(getMenuOneApi, {
  loadingKeep: 500,
  onSuccess: (res) => {
    currentMenu.value = {
      ...res.data,
      parentId: res.data.parentId || 0,
    }
  },
})

const updateMenu = (row: MenuListType) => {
  action.value = ActionEnum.Edit
  visible.value = true
  runGetMenuOne(row.id)
}

const { runAsync: runDeleteMenu } = useRequest(deleteMenuApi, {
  loadingKeep: 500,
})

const delMenus = (action: DeleteEnum, row?: MenuListType) => {
  let message = '此操作将永久删除该菜单, 是否继续?'
  let ids: string[] = []
  if (action === DeleteEnum.Single && row != undefined) {
    ids = [row.id]
  }
  if (action === DeleteEnum.Multiple) {
    message = `此操作将永久批量删除当前${selectedMenuIds.value.length}个菜单, 是否继续?`
    ids = selectedMenuIds.value
  }
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteMenu(ids)
          .then(() => {
            selectedMenuIds.value = []
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
    runGetMenu()
  })
}

const selectedMenuIds = ref<string[]>([])
const menuSelectionChange = (menus: MenuListType[]) => {
  selectedMenuIds.value = menus.map((menu) => menu.id)
}
</script>
<style scoped lang="scss">
.page-container {
}
</style>
