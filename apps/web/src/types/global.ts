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
