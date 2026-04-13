export type Result<T = any> = {
  code: number
  data: T
  message: string
}

export type ListResult<T = any> = {
  code: number
  data: {
    list: T[]
    total: number
  }
  message: string
}

export type SelectOptionItem<T = string> = {
  label: string
  value: T
}

export type SelectTreeItem<T = string> = {
  label: string
  value: T
  disabled?: boolean
  children?: SelectTreeItem<T>[]
}

/** 列格式化类型 */
export type ColumnFormat = 'date' | 'datetime' | 'time' | { type: 'enum'; dictCode: string }

/** 统一列配置 - 同时用于表格展示和导出 */
export interface ColumnConfig {
  /** 字段 key，支持 dot-notation 如 dept.deptName */
  key: string
  /** 列标题 */
  label: string
  /** 是否在表格中显示，默认 true */
  tableVisible?: boolean
  /** 是否可导出，默认 true */
  exportable?: boolean
  /** 导出时默认选中，默认 true */
  exportSelected?: boolean
  /** 格式化：日期或字典枚举 */
  format?: ColumnFormat
  /** 表格列宽 */
  tableWidth?: number | string
  /** 表格列最小宽度 */
  tableMinWidth?: number | string
  /** 表格列固定位置 */
  tableFixed?: 'left' | 'right' | true
  /** 表格列对齐 */
  tableAlign?: 'left' | 'center' | 'right'
}
