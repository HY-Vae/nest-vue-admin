<script setup lang="ts">
import { ref, type PropType, computed, watch } from 'vue'
import { ActionEnum } from '@/enums/common.ts'
import type { FormInstance, TreeInstance } from 'element-plus'
import type { CreateMenuType, IconResult, MenuListType } from '@/views/sys/menu/menu.type'
import { Plus } from '@element-plus/icons-vue'
import type { SelectTreeItem } from '@/types/global.ts'
import { fetchIconsFromCollection } from '@/views/sys/menu/fetchIcons.ts'
import IconPicker from '@/views/sys/menu/IconPicker.vue'
import Icon from '@/components/icon/icon.vue'
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
    type: Object as PropType<MenuListType>,
  },
  menuTree: {
    required: true,
    type: Array as PropType<SelectTreeItem[]>,
  },
  parentId: {
    type: Number,
    default: 0,
  },
})
const visible = defineModel<boolean>({ required: true })
const emits = defineEmits(['cancel', 'confirm'])
const menuFormRef = ref<FormInstance>()

const formLabelWidth = '100px'
const menuForm = ref<CreateMenuType>({
  auth: '',
  component: '',
  hidden: false,
  path: '',
  parentId: 0,
  name: '',
  sort: 0,
  status: '',
  remark: '',
  meta: {
    title: '',
    icon: '',
    defaultMenu: false,
    keepAlive: false,
    activeName: '',
    closeTab: true,
  },
  menuBtns: [],
})

const rules = {
  parentId: [{ required: true, message: '请选择上级菜单', trigger: 'blur' }],
  'meta.title': [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  name: [
    { required: true, message: '请输入路由名称', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  auth: [
    { required: true, message: '请输入权限值', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  path: [
    { required: true, message: '请输入访问路径', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'change' },
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'change' },
  ],
  status: [{ required: true, message: '请选择菜单状态', trigger: 'blur' }],
  remark: [{ max: 255, message: '长度不能超过255个字符', trigger: 'change' }],
}
const cancel = () => {
  visible.value = false
  emits('cancel')
}
const confirm = () => {
  menuFormRef.value?.validate((valid) => {
    if (valid) {
      emits('confirm', menuForm.value)
    }
  })
}

const closeDialog = () => {
  menuFormRef.value?.resetFields()
  menuForm.value = {
    auth: '',
    component: '',
    hidden: false,
    path: '',
    parentId: 0,
    name: '',
    sort: 0,
    status: '',
    remark: '',
    meta: {
      title: '',
      icon: '',
      defaultMenu: false,
      keepAlive: false,
      activeName: '',
      closeTab: true,
    },
    menuBtns: [],
  }
}

const title = computed(() => {
  return props.action === ActionEnum.Add ? '添加菜单' : '编辑菜单'
})

// 查找当前的菜单值
// const findCurrentMenu = (list: MenuTreeSelectType[], id: number) => {
//   let target = 0
//   for (let i = 0; i < list.length; i++) {
//   }
// }

const defaultExpandIds = computed(() => {
  if (props.current) {
    return [props.current.id]
  }
  return []
})

const iconInfo = ref<IconResult>({
  icons: [],
  total: 0,
})

const getIcons = async () => {
  const result = await fetchIconsFromCollection('ri')
  if (result) {
    iconInfo.value = result
  }
  return result
}

const searchIcons = async (searchKey: string) => {
  const result = await getIcons()
  if (!searchKey) {
    return result
  }
  const icons = result?.icons.filter((icon) => icon.includes(searchKey)) || []
  iconInfo.value = {
    icons,
    total: icons.length,
  }
}

const openMenu = async () => {
  authPrefix.value = ''
  activeTabName.value = 'menu'
  if (props.action === ActionEnum.Add) {
    menuForm.value.parentId = props.parentId
  }
  await getIcons()
}

const menuRef = ref<TreeInstance>()

const activeTabName = ref('menu')

const addBtnAuth = () => {
  menuForm.value.menuBtns.push({
    auth: '',
    name: '',
  })
}

const authPrefix = ref('')

const generateBtnAuth = () => {
  const menuName = menuForm.value.meta.title
  const authKeys = ['create', 'remove', 'removes', 'update', 'list', 'detail']
  const authNameKeys = [
    `新增${menuName}`,
    `删除单个${menuName}`,
    `批量删除${menuName}`,
    `编辑${menuName}`,
    `查询${menuName}列表`,
    `查询${menuName}详情`,
  ]
  //   判断是否已经含有某个权限值
  const btns = []
  debugger
  authKeys.forEach((auth, index) => {
    const key = [authPrefix.value, auth].join(':')
    if (!menuForm.value.menuBtns.some((item) => item.auth === key)) {
      btns.push({
        auth: key,
        name: authNameKeys[index],
      })
    }
  })
  menuForm.value.menuBtns = [...menuForm.value.menuBtns, ...btns]
}

const removeBtnAuth = (index: number) => {
  menuForm.value.menuBtns = menuForm.value.menuBtns.filter((item, i) => {
    return i !== index
  })
}

watch(
  () => props.current,
  (val) => {
    if (val != undefined && !props.detailLoading) {
      menuForm.value = val
    }
  },
)
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="1000"
    @open="openMenu"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="closeDialog"
  >
    <el-form
      :model="menuForm"
      class="menuForm"
      label-position="top"
      ref="menuFormRef"
      v-loading="detailLoading"
      :rules="rules"
    >
      <el-tabs v-model="activeTabName" class="demo-tabs">
        <el-tab-pane label="菜单信息" name="menu">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="上级菜单" :label-width="formLabelWidth" prop="parentId">
                <el-tree-select
                  check-strictly
                  v-model="menuForm.parentId"
                  treeRef="menuRef"
                  :data="menuTree"
                  highlight-current
                  auto-expand-parent
                  placeholder="请选择上级菜单"
                  :render-after-expand="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="meta.title">
                <el-input v-model="menuForm.meta.title" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="路由名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="menuForm.name" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="权限值" :label-width="formLabelWidth" prop="auth">
                <el-input v-model="menuForm.auth" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="访问路径" :label-width="formLabelWidth" prop="path">
                <el-input v-model="menuForm.path" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="组件路径" :label-width="formLabelWidth" prop="component">
                <el-input v-model="menuForm.component" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="激活路由" :label-width="formLabelWidth" prop="meta.activeName">
                <el-input v-model="menuForm.meta.activeName" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="icon" :label-width="formLabelWidth" prop="meta.icon">
                <el-popover placement="right" :width="400" trigger="click">
                  <template #reference>
                    <div class="flex">
                      <el-input v-model="menuForm.meta.icon" autocomplete="off" />
                      <Icon :icon="menuForm.meta.icon" v-if="menuForm.meta.icon" />
                    </div>
                  </template>
                  <icon-picker
                    v-model="menuForm.meta.icon"
                    :total="iconInfo.total"
                    :icons="iconInfo.icons"
                    @searchIcons="searchIcons"
                  />
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="开启缓存" :label-width="formLabelWidth" prop="meta.keepAlive">
                <el-switch v-model="menuForm.meta.keepAlive" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="tab可关闭" :label-width="formLabelWidth" prop="meta.closeTab">
                <el-switch v-model="menuForm.meta.closeTab" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否默认路由"
                :label-width="formLabelWidth"
                prop="meta.defaultMenu"
              >
                <el-switch v-model="menuForm.meta.defaultMenu" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否隐藏" :label-width="formLabelWidth" prop="hidden">
                <el-switch v-model="menuForm.hidden" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
                <el-input-number v-model="menuForm.sort" :min="0" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24"> </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="菜单状态" :label-width="formLabelWidth" prop="status">
                <el-select v-model="menuForm.status" placeholder="请选择菜单状态">
                  <el-option label="正常" value="0" />
                  <el-option label="异常" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
                <el-input
                  type="textarea"
                  maxlength="255"
                  show-word-limit
                  :autosize="{ minRows: 3, maxRows: 5 }"
                  v-model="menuForm.remark"
                  autocomplete="off"
                  word-limit-position="outside"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="按钮权限" name="btn">
          <el-row justify="space-between">
            <el-button type="primary" :icon="Plus" plain @click="addBtnAuth">
              新增按钮权限
            </el-button>
            <div class="flex">
              <el-input
                v-model="authPrefix"
                placeholder="请输入权限前缀"
                autocomplete="off"
              ></el-input>
              <el-button type="primary" plain text @click="generateBtnAuth">一键生成</el-button>
            </div>
          </el-row>
          <el-row :gutter="24" style="margin: 12px 0" v-show="menuForm.menuBtns.length > 0">
            <el-col :span="6">
              <span>功能名称：</span>
            </el-col>
            <el-col :span="6">
              <span>权限值：</span>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-for="(btn, index) in menuForm.menuBtns" :key="index">
            <el-col :span="6">
              <el-form-item
                label-position="left"
                :prop="'menuBtns.' + index + '.name'"
                :rules="{
                  required: true,
                  message: '功能名称不能为空',
                  trigger: 'blur',
                }"
              >
                <el-input v-model="btn.name" placeholder="请输入功能名称" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label-position="left"
                :prop="'menuBtns.' + index + '.auth'"
                :rules="{
                  required: true,
                  message: '权限值不能为空',
                  trigger: 'blur',
                }"
              >
                <el-input v-model="btn.auth" placeholder="请输入功能名称" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-button link @click.prevent="removeBtnAuth(index)" class="!h-[32px]">
              删除
            </el-button>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm" :loading="loading"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.menuForm {
  :global(.el-tabs__nav-wrap:after) {
    background-color: transparent;
  }
}
</style>
