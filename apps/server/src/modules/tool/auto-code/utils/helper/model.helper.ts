import { FieldTypeEnum } from '@/common/enums/gen.enum';
import { FieldDto } from '../../dto/req-auto-code.dto';

function createFieldName(field: FieldDto): string {
  return field.name;
}

function createFieldType(field: FieldDto): string {
  if (field.type === FieldTypeEnum.TEXT) {
    return field.isRequired ? 'String' : 'String?';
  }
  if (field.isPrimary) {
    return field.type;
  }
  return field.isRequired ? `${field.type}` : `${field.type}?`;
}

function createFieldUnique(field: FieldDto): string {
  return field.isUnique ? `@unique` : '';
}

function createFieldDefaultValue(field: FieldDto): string {
  // 需要处理几种场景， id是数字类型的 id 为 dateTime的
  const defaultValue = field.defaultValue || '';
  // if (field.isPrimary && field.primaryKey?.isAutoIncrement) {
  //   defaultValue = 'autoincrement()';
  // }
  // if (field.type === FieldType.DateTime && field.dateTime?.isNow) {
  //   defaultValue = 'now()';
  // }
  return field.defaultValue ? `@default(${defaultValue})` : '';
}

function createFieldDataType(field: FieldDto): string {
  const size = field.size || 191;
  switch (field.type) {
    case FieldTypeEnum.STRING:
      return `@db.VarChar(${size})`;
    case FieldTypeEnum.TEXT:
      return '@db.Text';
    case FieldTypeEnum.INT:
      return field.isPrimary ? '' : '@db.Int';
    case FieldTypeEnum.FLOAT:
      return '@db.Float';
    case FieldTypeEnum.DECIMAL:
      return `@db.Decimal(${field.decimal!.precision}, ${field.decimal!.scale})`;
    case FieldTypeEnum.BOOLEAN:
      return '';
    case FieldTypeEnum.DATETIME:
      return '';
  }
}

function createFieldPrimaryKey(field: FieldDto): string {
  if (field.isPrimary) {
    return '@id';
  }
  return '';
}

function createFieldMap(field: FieldDto): string {
  const dbName = field.name === field.dataName ? '' : field.dataName;
  return dbName ? `@map("${field.dataName}")` : '';
}

export function generateField(field: FieldDto) {
  const fieldName = createFieldName(field);
  const fieldType = createFieldType(field);
  const fieldUnique = createFieldUnique(field);
  const defaultStr = createFieldDefaultValue(field);
  const dataType = createFieldDataType(field);
  // const comment = createFieldComment(field);
  const primaryKey = createFieldPrimaryKey(field);
  const fieldMap = createFieldMap(field);
  const other = field.prismaOther || '';
  return `/// ${field.nameCh}
  ${fieldName} ${fieldType} ${fieldUnique}  ${primaryKey} ${fieldMap} ${defaultStr} ${dataType} ${other}`;
}
