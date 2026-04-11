<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRequest } from 'vue-request'
import {
  getUserNoticesApi,
  getUserTodosApi,
  markNoticeReadApi,
  completeTodoApi,
  cancelTodoApi,
  getMessageSummaryApi,
  type NoticeListType,
  type TodoListType,
} from './service'

const route = useRoute()
const router = useRouter()

// 消息类型
type MessageType = 'notice' | 'todo'

// 当前选中的消息类型
const activeType = ref<MessageType>((route.query.type as MessageType) || 'notice')

// 消息汇总
const summary = ref({ noticeUnread: 0, todoPending: 0 })

// 侧边栏配置
const menuItems = computed(() => [
  {
    key: 'notice',
    label: '通知公告',
    icon: 'Bell',
    badge: summary.value.noticeUnread || 0,
  },
  {
    key: 'todo',
    label: '待办事项',
    icon: 'List',
    badge: summary.value.todoPending || 0,
  },
])

// 筛选条件 - 默认显示未读
const filterType = ref<'all' | 'read' | 'unread'>('unread')

// 通知列表
const noticeList = ref<NoticeListType[]>([])
const noticeTotal = ref(0)
const noticePagination = reactive({
  current: 1,
  pageSize: 10,
})

// 待办列表
const todoList = ref<TodoListType[]>([])
const todoTotal = ref(0)
const todoPagination = reactive({
  current: 1,
  pageSize: 10,
})

// 加载状态
const noticeLoading = ref(false)
const todoLoading = ref(false)

// 详情弹窗
const detailVisible = ref(false)
const detailItem = ref<NoticeListType | TodoListType | null>(null)
const detailType = ref<MessageType>('notice')

// 业务类型配置
const bizTypeConfig: Record<string, { label: string; type: 'primary' | 'success' | 'warning' | 'danger' | 'info' }> = {
  approval: { label: '审批', type: 'primary' },
  confirm: { label: '确认', type: 'warning' },
  review: { label: '审核', type: 'info' },
}

// 优先级配置
const priorityConfig: Record<string, { label: string; type: 'danger' | 'warning' | 'info' | '' }> = {
  urgent: { label: '紧急', type: 'danger' },
  high: { label: '高', type: 'warning' },
  normal: { label: '普通', type: 'info' },
  low: { label: '低', type: '' },
}

// 获取消息汇总
const fetchSummary = async () => {
  try {
    const res = await getMessageSummaryApi()
    summary.value = res.data
  } catch {
    // ignore
  }
}

// 获取通知列表
const { run: runNoticeQuery, loading: noticeQueryLoading } = useRequest(
  () =>
    getUserNoticesApi({
      current: noticePagination.current,
      pageSize: noticePagination.pageSize,
      isRead:
        filterType.value === 'unread'
          ? false
          : filterType.value === 'read'
            ? true
            : undefined,
    }),
  {
    manual: false,
    loadingKeep: 300,
    onSuccess: (res) => {
      noticeList.value = res.data?.list || []
      noticeTotal.value = res.data?.total || 0
    },
  },
)

// 获取待办列表
const { run: runTodoQuery, loading: todoQueryLoading } = useRequest(
  () =>
    getUserTodosApi({
      current: todoPagination.current,
      pageSize: todoPagination.pageSize,
      status: filterType.value === 'unread' ? 'pending' : undefined,
    }),
  {
    manual: true,
    loadingKeep: 300,
    onSuccess: (res) => {
      todoList.value = res.data?.list || []
      todoTotal.value = res.data?.total || 0
    },
  },
)

// 切换消息类型
const handleMenuChange = (key: MessageType) => {
  activeType.value = key
  router.replace({ query: { type: key } })
  filterType.value = 'unread'
  if (key === 'notice') {
    noticePagination.current = 1
    runNoticeQuery()
  } else {
    todoPagination.current = 1
    runTodoQuery()
  }
}

// 切换筛选
const handleFilterChange = () => {
  if (activeType.value === 'notice') {
    noticePagination.current = 1
    runNoticeQuery()
  } else {
    todoPagination.current = 1
    runTodoQuery()
  }
}

// 分页变化
const handlePageChange = (page: number) => {
  if (activeType.value === 'notice') {
    noticePagination.current = page
    runNoticeQuery()
  } else {
    todoPagination.current = page
    runTodoQuery()
  }
}

// 查看详情
const handleViewDetail = async (item: NoticeListType | TodoListType, type: MessageType) => {
  detailItem.value = item
  detailType.value = type
  detailVisible.value = true

  // 通知标记已读
  if (type === 'notice' && !item.isRead) {
    await markNoticeReadApi(item.id)
    item.isRead = true
    summary.value.noticeUnread = Math.max(0, summary.value.noticeUnread - 1)
  }
}

// 完成待办
const handleCompleteTodo = async (item: TodoListType) => {
  await completeTodoApi(item.id)
  ElMessage.success('待办已完成')
  detailVisible.value = false
  item.status = 'completed'
  summary.value.todoPending = Math.max(0, summary.value.todoPending - 1)
}

// 取消待办
const handleCancelTodo = async (item: TodoListType) => {
  await cancelTodoApi(item.id)
  ElMessage.success('待办已取消')
  detailVisible.value = false
  item.status = 'cancelled'
  summary.value.todoPending = Math.max(0, summary.value.todoPending - 1)
}

// 跳转处理
const handleGoLink = (item: TodoListType) => {
  if (item.link) {
    router.push(item.link)
    detailVisible.value = false
  }
}

// 格式化时间
const formatTime = (date: Date | string) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)} 分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)} 小时前`
  } else if (diff < week) {
    return `${Math.floor(diff / day)} 天前`
  } else {
    return d.toLocaleDateString()
  }
}

// 监听类型变化
watch(activeType, (val) => {
  if (val === 'todo' && todoList.value.length === 0) {
    runTodoQuery()
  }
})

// 初始化
onMounted(() => {
  fetchSummary()
})
</script>

<template>
  <div class="page-container message-center">
    <el-row :gutter="16" class="message-row">
      <!-- 左侧菜单 -->
      <el-col :span="4">
        <el-card shadow="never" class="menu-card">
          <div
            v-for="item in menuItems"
            :key="item.key"
            :class="['menu-item', { active: activeType === item.key }]"
            @click="handleMenuChange(item.key as MessageType)"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span class="menu-label">{{ item.label }}</span>
            <el-badge v-if="item.badge > 0" :value="item.badge" :max="99" />
          </div>
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :span="20">
        <el-card shadow="never" class="content-card">
          <!-- 头部 -->
          <div class="content-header">
            <div class="filter-group">
              <el-radio-group v-model="filterType" @change="handleFilterChange">
                <el-radio-button value="all">全部</el-radio-button>
                <el-radio-button value="unread">未读</el-radio-button>
                <el-radio-button value="read">已读</el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <!-- 通知列表 -->
          <div v-if="activeType === 'notice'" v-loading="noticeQueryLoading" class="message-list">
            <div v-if="noticeList.length === 0" class="empty-state">
              <el-empty description="暂无通知" />
            </div>
            <div
              v-for="item in noticeList"
              :key="item.id"
              :class="['message-item', { unread: !item.isRead }]"
              @click="handleViewDetail(item, 'notice')"
            >
              <div class="item-header">
                <div class="item-meta">
                  <el-tag v-if="!item.isRead" type="danger" size="small" effect="dark">未读</el-tag>
                  <span class="item-title">{{ item.title }}</span>
                </div>
                <span class="item-time">{{ formatTime(item.createdAt) }}</span>
              </div>
              <div class="item-content">{{ item.content }}</div>
            </div>
          </div>

          <!-- 待办列表 -->
          <div v-if="activeType === 'todo'" v-loading="todoQueryLoading" class="message-list">
            <div v-if="todoList.length === 0" class="empty-state">
              <el-empty description="暂无待办" />
            </div>
            <div
              v-for="item in todoList"
              :key="item.id"
              :class="['message-item', 'todo-item', `status-${item.status}`]"
              @click="handleViewDetail(item, 'todo')"
            >
              <div class="item-header">
                <div class="item-meta">
                  <el-tag :type="bizTypeConfig[item.bizType]?.type || 'info'" size="small">
                    {{ bizTypeConfig[item.bizType]?.label || item.bizType }}
                  </el-tag>
                  <el-tag
                    v-if="item.priority !== 'normal'"
                    :type="priorityConfig[item.priority]?.type"
                    size="small"
                  >
                    {{ priorityConfig[item.priority]?.label }}
                  </el-tag>
                  <span class="item-title">{{ item.title }}</span>
                </div>
                <span class="item-time">{{ formatTime(item.createdAt) }}</span>
              </div>
              <div class="item-content">{{ item.content }}</div>
              <div v-if="item.status === 'pending'" class="item-actions">
                <el-button type="primary" size="small" @click.stop="handleCompleteTodo(item)">
                  完成
                </el-button>
                <el-button size="small" @click.stop="handleCancelTodo(item)">
                  取消
                </el-button>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="(activeType === 'notice' && noticeTotal > 10) || (activeType === 'todo' && todoTotal > 10)" class="pagination-wrapper">
            <el-pagination
              :current-page="activeType === 'notice' ? noticePagination.current : todoPagination.current"
              :page-size="activeType === 'notice' ? noticePagination.pageSize : todoPagination.pageSize"
              :total="activeType === 'notice' ? noticeTotal : todoTotal"
              layout="prev, pager, next"
              @current-change="handlePageChange"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      :title="detailType === 'notice' ? '通知详情' : '待办详情'"
      width="560px"
      :close-on-click-modal="false"
    >
      <div v-if="detailItem" class="detail-content">
        <div class="detail-header">
          <template v-if="detailType === 'todo'">
            <el-tag :type="bizTypeConfig[(detailItem as TodoListType).bizType]?.type || 'info'" size="small">
              {{ bizTypeConfig[(detailItem as TodoListType).bizType]?.label }}
            </el-tag>
            <el-tag
              v-if="(detailItem as TodoListType).priority !== 'normal'"
              :type="priorityConfig[(detailItem as TodoListType).priority]?.type"
              size="small"
            >
              {{ priorityConfig[(detailItem as TodoListType).priority]?.label }}
            </el-tag>
          </template>
          <span class="detail-time">{{ new Date(detailItem.createdAt).toLocaleString() }}</span>
        </div>
        <h3 class="detail-title">{{ detailItem.title }}</h3>
        <el-divider />
        <div class="detail-body">{{ detailItem.content }}</div>
      </div>
      <template #footer>
        <template v-if="detailType === 'todo' && (detailItem as TodoListType)?.status === 'pending'">
          <el-button v-if="(detailItem as TodoListType)?.link" type="primary" @click="handleGoLink(detailItem as TodoListType)">
            去处理
          </el-button>
          <el-button type="success" @click="handleCompleteTodo(detailItem as TodoListType)">
            完成
          </el-button>
          <el-button @click="handleCancelTodo(detailItem as TodoListType)">
            取消
          </el-button>
        </template>
        <el-button v-else @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.message-center {
  .message-row {
    min-height: calc(100vh - 180px);
  }

  .menu-card {
    :deep(.el-card__body) {
      padding: 12px 0;
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 14px 20px;
    cursor: pointer;
    transition: all 0.2s;
    border-left: 3px solid transparent;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    &.active {
      background-color: var(--el-color-primary-light-9);
      border-left-color: var(--el-color-primary);
      color: var(--el-color-primary);
    }

    .el-icon {
      font-size: 18px;
    }

    .menu-label {
      margin-left: 10px;
      flex: 1;
    }

    :deep(.el-badge__content) {
      transform: translateY(-2px);
      border: none;
    }
  }

  .content-card {
    min-height: calc(100vh - 180px);

    .content-header {
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    .message-list {
      .empty-state {
        padding: 60px 0;

        :deep(.el-empty__image) {
          filter: var(--el-empty-image-filter, none);
        }
      }

      .message-item {
        padding: 16px;
        margin-bottom: 12px;
        border-radius: 8px;
        border: 1px solid var(--el-border-color-lighter);
        cursor: pointer;
        transition: all 0.2s;
        background-color: var(--el-bg-color);

        &:hover {
          background-color: var(--el-fill-color-light);
          border-color: var(--el-color-primary-light-5);
        }

        &.unread,
        &.status-pending {
          background-color: var(--el-color-primary-light-9);
          border-color: var(--el-color-primary-light-7);
        }

        &.todo-item {
          &.status-completed {
            opacity: 0.6;
          }

          &.status-cancelled {
            opacity: 0.4;
          }
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .item-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
            overflow: hidden;

            .item-title {
              font-weight: 500;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .item-time {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            flex-shrink: 0;
          }
        }

        .item-content {
          font-size: 13px;
          color: var(--el-text-color-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
        }

        .item-actions {
          margin-top: 12px;
          display: flex;
          gap: 8px;
        }
      }
    }

    .pagination-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--el-border-color-lighter);
    }
  }
}

.detail-content {
  .detail-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;

    .detail-time {
      margin-left: auto;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }

  .detail-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .detail-body {
    font-size: 14px;
    line-height: 1.8;
    color: var(--el-text-color-regular);
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>

<!-- 暗黑模式样式 -->
<style lang="scss">
html.dark .message-center {
  .content-card .message-list .message-item.unread,
  .content-card .message-list .message-item.status-pending {
    background-color: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
    border-color: color-mix(in srgb, var(--el-color-primary) 30%, transparent);

    &:hover {
      background-color: color-mix(in srgb, var(--el-color-primary) 18%, transparent);
    }
  }

  .menu-item.active {
    background-color: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
  }
}
</style>
