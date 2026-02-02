import { FieldTypeEnum, GenTypeEnum, SearchTypeEnum } from '@/enums/gen.enum.ts'

export interface DecimalType {
  precision: number
  scale: number
}

export interface BaseFieldType {
  nameCh: string
  name: string
  nameJson: string
  dataName: string
  type: FieldTypeEnum
  prismaOther: string
  isRequired: boolean
  isSearch: boolean
  isPrimary: boolean
  isTranslate: boolean
  isAutoIncrement: boolean
  isAdd: boolean
  isShowTable: boolean
  isUnique: boolean
  searchType?: SearchTypeEnum
  defaultValue: string
  size: number
  formItemType: GenTypeEnum
  dictCode: string
  decimal?: DecimalType
}

export interface FieldDeaultOptionType {
  size: number
  defaultValue: string
  isTranslate: boolean
  isAutoIncrement: boolean
  dictCode: string
  formItemType: GenTypeEnum
  isSearch: boolean
  decimal?: DecimalType
}
