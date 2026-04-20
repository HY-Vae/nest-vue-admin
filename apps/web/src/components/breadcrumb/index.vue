<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.ts'
import type { MenuListType } from '@/views/sys/menu/menu.type'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

/** 从菜单树中递归查找目标节点，返回从根到目标的路径 */
function findBreadcrumbPath(
  menus: MenuListType[],
  targetName: string,
  path: MenuListType[] = [],
): MenuListType[] | null {
  for (const menu of menus) {
    if (menu.name === targetName) {
      return [...path, menu]
    }
    if (menu.children?.length) {
      const found = findBreadcrumbPath(menu.children, targetName, [...path, menu])
      if (found) return found
    }
  }
  return null
}

const breadcrumbItems = computed(() => {
  const targetName = (route.meta?.activeName as string) || (route.name as string)
  if (!targetName || !userStore.menus.length) return []
  return findBreadcrumbPath(userStore.menus, targetName) || []
})

function handleNavigate(name: string) {
  router.push({ name })
}

/** 过滤隐藏的子菜单 */
function visibleChildren(children?: MenuListType[]) {
  if (!children) return []
  return children.filter((c) => !c.hidden)
}
</script>

<template>
  <el-breadcrumb
    v-if="breadcrumbItems.length > 0"
    separator="/"
    class="breadcrumb"
  >
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbItems"
      :key="item.name"
    >
      <!-- 非最后一级且有不隐藏的子菜单：下拉可跳转 -->
      <el-dropdown
        v-if="index < breadcrumbItems.length - 1 && visibleChildren(item.children).length > 0"
        trigger="hover"
        @command="handleNavigate"
      >
        <span class="breadcrumb-link">
          {{ item.meta?.title }}
          <el-icon class="breadcrumb-arrow"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="child in visibleChildren(item.children)"
              :key="child.name"
              :command="child.name"
              :class="{ 'is-active': child.name === (route.meta?.activeName || route.name) }"
            >
              {{ child.meta?.title }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 非最后一级但没有可见子菜单：纯文本 -->
      <span v-else-if="index < breadcrumbItems.length - 1">{{ item.meta?.title }}</span>

      <!-- 最后一级：纯文本 -->
      <span v-else class="breadcrumb-current">{{ item.meta?.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.breadcrumb {
  line-height: 1;

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    color: var(--el-text-color-regular);
    transition: color 0.2s;

    &:hover {
      color: var(--el-color-primary);
    }

    .breadcrumb-arrow {
      font-size: 12px;
      margin-left: 2px;
    }
  }

  .breadcrumb-current {
    color: var(--el-text-color-primary);
  }
}

:deep(.is-active) {
  color: var(--el-color-primary) !important;
  font-weight: 600;
}

</style>
