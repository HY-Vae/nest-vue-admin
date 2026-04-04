import type { ListResult, Result, SelectTreeItem } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type {
  CreateSysDeptType,
  QuerySysDeptType,
  SysDeptListType,
  UpdateSysDeptType,
} from './sysDept.type'

export function getSysDeptApi(params: QuerySysDeptType): Promise<ListResult<SysDeptListType>> {
  return request('/sys/dept', {
    method: 'GET',
    params,
  })
}

export function getSysDeptOneApi(id: string): Promise<Result<SysDeptListType>> {
  return request(`/sys/dept/${id}`, {
    method: 'GET',
  })
}

export function addSysDeptApi(data: CreateSysDeptType): Promise<Result> {
  return request('/sys/dept', {
    method: 'POST',
    data,
  })
}

export function updateSysDeptApi(data: UpdateSysDeptType): Promise<Result> {
  return request(`/sys/dept/${data.id}`, {
    method: 'PATCH',
    data,
  })
}

export function deleteSysDeptApi(id: string): Promise<Result> {
  return request(`/sys/dept/${id}`, {
    method: 'DELETE',
  })
}

export function deleteSysDeptsApi(ids: string[]): Promise<Result> {
  return request(`/sys/dept`, {
    method: 'DELETE',
    data: {
      ids,
    },
  })
}

// 获取部门选项树（用于下拉选择）
export async function getDeptOptionsApi(): Promise<Result<SelectTreeItem[]>> {
  const res = await getSysDeptApi({})

  // 递归转换部门树为选项树
  const transform = (list: SysDeptListType[]): SelectTreeItem[] => {
    return list.map((item) => ({
      value: item.id,
      label: item.deptName,
      children: item.children && item.children.length > 0 ? transform(item.children) : [],
    }))
  }

  return {
    code: 200,
    message: 'success',
    data: transform(res.data.list),
  }
}

// 获取组织架构树（部门 + 岗位）
export function getOrgTreeApi(): Promise<Result<OrgTreeNodeType[]>> {
  return request('/sys/dept/org-tree', {
    method: 'GET',
  })
}

// 组织架构树节点类型
export interface OrgTreeNodeType {
  id: string
  name: string
  code: string
  parentId: string | null
  sort: number
  status: string
  userCount: number
  totalUserCount?: number
  nodeType: 'dept' | 'post'
  isLeader?: boolean
  isCommon?: boolean
  children?: OrgTreeNodeType[]
}
