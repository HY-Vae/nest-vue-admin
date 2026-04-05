import { Request } from 'express'
import path from 'node:path'
import { v4 as uuidv4 } from 'uuid'
import { SysMenu } from '@prisma/client'

export interface MenuTreeNode extends Omit<SysMenu, 'children'> {
  children: MenuTreeNode[]
  meta?: {
    title?: string
    icon?: string
    [key: string]: unknown
  }
}

export function buildMenuTree(
  menus: SysMenu[],
  rootValue: number | null = null,
): MenuTreeNode[] {
  const menuMap = new Map<number, MenuTreeNode>()
  const rootMenus: MenuTreeNode[] = []

  // 创建ID映射
  menus.forEach((menu) => {
    menuMap.set(menu.id, { ...menu, children: [] })
  })

  // 构建树关系
  menus.forEach((menu) => {
    const node = menuMap.get(menu.id)!
    if (menu.parentId === rootValue) {
      // 根节点
      rootMenus.push(node)
    } else {
      // 子节点
      const parent = menuMap.get(menu.parentId!)
      if (parent) {
        parent.children.push(node)
      }
    }
  })

  // 按排序字段整理
  const sortChildren = (node: MenuTreeNode) => {
    if (node.children?.length) {
      node.children.sort((a, b) => a.sort - b.sort)
      node.children.forEach(sortChildren)
    }
  }

  rootMenus.sort((a, b) => a.sort - b.sort)
  rootMenus.forEach(sortChildren)

  return rootMenus
}

export function generateUUid(): string {
  return uuidv4().replaceAll('-', '')
}

export function generateRedisKey(...keys: string[]): string {
  return keys.join(':')
}

export function getRelativePath(pathStr: string): string {
  // 1. 规范化路径（处理跨平台分隔符和冗余符号）
  const normalized = path.normalize(pathStr)

  // 2. 统一替换为 Unix 风格斜杠（兼容 Windows）
  const unixPath = normalized.replace(/\\/g, '/')

  // 3. 去除开头和结尾的斜杠，合并中间重复斜杠
  return unixPath
    .replace(/^\/+/, '') // 去除开头的斜杠
    .replace(/\/+$/, '') // 去除结尾的斜杠
    .replace(/\/+/g, '/') // 合并中间的多个斜杠
}

export function getRequestIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for']
  const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded

  const ip = forwardedIp || req.socket.remoteAddress || req.ip || ''

  if (ip.includes('::ffff:')) {
    return ip.split('::ffff:')[1]
  }

  return ip
}
