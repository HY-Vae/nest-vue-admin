<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue'
import { getUnreadCountApi, getUserNoticesApi, markAsReadApi, markAllAsReadApi } from '@/views/sys/notice/service'
import type { NoticeListType } from '@/views/sys/notice/notice.type'
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const unreadCount = ref(0)
const notices = ref<NoticeListType[]>([])
const loading = ref(false)
const popoverVisible = ref(false)
const detailVisible = ref(false)
const currentNotice = ref<NoticeListType | null>(null)

// 通知类型配置
const noticeTypeConfig: Record<string, { label: string; type: 'primary' | 'success' | 'warning' | 'danger' | 'info' }> = {
  notice: { label: '公告', type: 'primary' },
  warning: { label: '警告', type: 'warning' },
  system: { label: '系统', type: 'info' },
  urgent: { label: '紧急', type: 'danger' },
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

// 获取未读数量
const fetchUnreadCount = async () => {
  try {
    const res = await getUnreadCountApi()
    unreadCount.value = res.data.count
  } catch {
    // ignore
  }
}

// 获取通知列表
const fetchNotices = async () => {
  loading.value = true
  try {
    const res = await getUserNoticesApi()
    notices.value = res.data?.list || []
  } finally {
    loading.value = false
  }
}

// 查看通知详情
const handleViewDetail = async (notice: NoticeListType) => {
  currentNotice.value = notice
  detailVisible.value = true
  popoverVisible.value = false

  // 标记为已读
  if (!notice.isRead) {
    await markAsReadApi(notice.id)
    notice.isRead = true
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }
}

// 标记全部已读
const handleReadAll = async () => {
  if (unreadCount.value === 0) return
  await markAllAsReadApi()
  notices.value.forEach((n) => (n.isRead = true))
  unreadCount.value = 0
  ElMessage.success('已全部标记为已读')
}

// 弹窗显示时获取数据
const handleShow = () => {
  fetchNotices()
  fetchUnreadCount()
}

// 当前通知的类型配置
const currentNoticeType = computed(() => {
  if (!currentNotice.value) return noticeTypeConfig.notice
  return noticeTypeConfig[currentNotice.value.type] || noticeTypeConfig.notice
})

// 查看全部 - 跳转消息中心（默认显示未读）
const handleViewAll = () => {
  popoverVisible.value = false
  router.push('/message-center/list?type=notice')
}

onMounted(() => {
  fetchUnreadCount()
})
</script>

<template>
  <el-popover
    placement="bottom-end"
    :width="380"
    trigger="click"
    @before-enter="handleShow"
    v-model:visible="popoverVisible"
  >
    <template #reference>
      <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99" class="notice-badge">
        <el-button :icon="Bell" circle />
      </el-badge>
    </template>

    <div class="notice-popover">
      <div class="notice-header">
        <span class="title">通知公告</span>
        <el-button
          type="primary"
          link
          size="small"
          @click="handleReadAll"
          :disabled="unreadCount === 0"
        >
          全部已读
        </el-button>
      </div>

      <el-scrollbar max-height="420px" v-loading="loading">
        <div v-if="notices.length === 0" class="notice-empty">
          <el-empty description="暂无通知" :image-size="80" />
        </div>
        <div v-else class="notice-list">
          <div
            v-for="item in notices"
            :key="item.id"
            :class="['notice-item', { 'is-read': item.isRead, 'is-unread': !item.isRead }]"
            @click="handleViewDetail(item)"
          >
            <div class="notice-item-header">
              <div class="notice-item-meta">
                <el-tag
                  :type="noticeTypeConfig[item.type]?.type || 'primary'"
                  size="small"
                >
                  {{ noticeTypeConfig[item.type]?.label || '通知' }}
                </el-tag>
                <span v-if="!item.isRead" class="unread-dot"></span>
              </div>
              <span class="time">{{ formatTime(item.createdAt) }}</span>
            </div>
            <div class="notice-item-title">{{ item.title }}</div>
            <div class="notice-item-content">{{ item.content }}</div>
          </div>
        </div>
      </el-scrollbar>

      <div v-if="notices.length > 0 || unreadCount > 0" class="notice-footer">
        <el-button type="primary" link size="small" @click="handleViewAll">
          查看全部{{ unreadCount > notices.length ? ` (${unreadCount}条)` : '' }}
        </el-button>
      </div>
    </div>
  </el-popover>

  <!-- 通知详情弹窗 -->
  <el-dialog
    v-model="detailVisible"
    :title="currentNoticeType?.label || '通知详情'"
    width="560px"
    :close-on-click-modal="false"
    class="notice-detail-dialog"
  >
    <div v-if="currentNotice" class="notice-detail">
      <div class="notice-detail-header">
        <el-tag :type="currentNoticeType.type" size="small">
          {{ currentNoticeType.label }}
        </el-tag>
        <span class="notice-detail-time">
          {{ new Date(currentNotice.createdAt).toLocaleString() }}
        </span>
      </div>
      <h3 class="notice-detail-title">{{ currentNotice.title }}</h3>
      <el-divider />
      <div class="notice-detail-content">
        {{ currentNotice.content }}
      </div>
    </div>
    <template #footer>
      <el-button @click="detailVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.notice-badge {
  :deep(.el-badge__content) {
    transform: translateY(-4px) translateX(4px);
  }
}
</style>

<!-- 暗黑模式全局样式 - popover 渲染到 body 下需要全局样式 -->
<style lang="scss">
html.dark .notice-popover {
  background-color: #1d1d1d;

  .notice-header {
    border-bottom-color: #363637;
  }

  .notice-item {
    background-color: transparent;
    border-color: #363637;

    &:hover {
      background-color: #262727;
      border-color: #414243;
    }

    &.is-unread {
      background-color: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
      border-color: color-mix(in srgb, var(--el-color-primary) 30%, transparent);
    }
  }

  .notice-footer {
    border-top-color: #363637;
  }
}
</style>

<style lang="scss" scoped>
.notice-popover {
  margin: -12px;

  .notice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .title {
      font-weight: 600;
      font-size: 15px;
    }
  }

  .notice-empty {
    padding: 20px 0;
  }

  .notice-list {
    padding: 0 12px;

    .notice-item {
      padding: 12px;
      margin: 8px 0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;

      &:hover {
        background-color: var(--el-fill-color-light);
        border-color: var(--el-border-color-lighter);
      }

      &.is-unread {
        background-color: rgba(64, 158, 255, 0.1);
        border-color: rgba(64, 158, 255, 0.3);

        .notice-item-title {
          font-weight: 600;
        }
      }

      &.is-read {
        opacity: 0.7;
      }

      .notice-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .notice-item-meta {
          display: flex;
          align-items: center;
          gap: 6px;

          .unread-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--el-color-danger);
          }
        }

        .time {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }

      .notice-item-title {
        font-weight: 500;
        margin-bottom: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--el-text-color-primary);
      }

      .notice-item-content {
        font-size: 13px;
        color: var(--el-text-color-secondary);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.5;
      }
    }
  }

  .notice-footer {
    padding: 12px 16px;
    border-top: 1px solid var(--el-border-color-lighter);
    text-align: center;
  }
}

.notice-detail {
  .notice-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .notice-detail-time {
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }

  .notice-detail-title {
    margin: 0 0 0 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .notice-detail-content {
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
