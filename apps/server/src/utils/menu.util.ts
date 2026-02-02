import { SelectTreeItem } from '@/common/types/common.type';
export function simplifyMenuTree(
  originalTree: any[],
): SelectTreeItem<number>[] {
  return originalTree.map((item) => ({
    value: item.id,
    label: item.meta?.title || '',
    children:
      item.children && item.children.length > 0
        ? simplifyMenuTree(item.children)
        : [],
  }));
}
