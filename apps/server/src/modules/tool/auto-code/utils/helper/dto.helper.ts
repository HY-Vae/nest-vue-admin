import { BASE_STRING_LENGTH, validateTypeMap } from '../constant';
import { FieldType } from '../enum';
import { FieldDto } from '../../dto/req-auto-code.dto';
import { FieldTypeEnum } from '@/common/enums/gen.enum';

function getClassValidateType(type: FieldTypeEnum) {
  switch (type) {
    case FieldTypeEnum.BOOLEAN:
      return '@IsBoolean()';
    case FieldTypeEnum.DATETIME:
      return '@IsDate()';
    case FieldTypeEnum.DECIMAL:
      return '@IsNumber()';
    case FieldTypeEnum.FLOAT:
      return '@IsNumber()';
    case FieldTypeEnum.INT:
      return '@IsNumber()';
    case FieldTypeEnum.STRING:
      return '@IsString()';
  }
}

function createValidateName(item: FieldDto) {
  if (!item.isRequired) {
    return `${item.name}?: ${validateTypeMap[item.type]};`;
  }
  return `${item.name}: ${validateTypeMap[item.type]};`;
}

function createOptionalValidateName(item: FieldDto) {
  return `${item.name}?: ${validateTypeMap[item.type]};`;
}

function createValidateType(type: FieldTypeEnum, isTranslate?: boolean) {
  if (isTranslate) {
    if (type === FieldTypeEnum.DATETIME) {
      return `@Type(() => Date)`;
    }
    return `@Type()`;
  }
  return '';
}

function createQueryValidateType(type: FieldTypeEnum) {
  if (type === FieldTypeEnum.DATETIME) {
    return `@Type(() => Date)`;
  }
  if (validateTypeMap[type] === 'number') {
    return `@Type()`;
  }
  return '';
}

function createOptional(isRequired?: boolean) {
  if (isRequired) {
    return `@IsNotEmpty()`;
  }
  return `@IsOptional()`;
}

function createExcel(nameZh: string) {
  return `@Excel({ name: '${nameZh}' })`;
}

function createLength(item: FieldDto) {
  if (item.type === FieldTypeEnum.DATETIME) return '';
  if (validateTypeMap[item.type] === 'string') {
    const length = item.size == undefined ? BASE_STRING_LENGTH : item.size;
    return `@MaxLength(${length})`;
  }
  return '';
}

export function QueryDtoHelper(item: FieldDto) {
  return `
  ${createSwaggarDtoDesc(item)}
  ${getClassValidateType(item.type)}
  ${createOptional(false)}
  ${createQueryValidateType(item.type)}
  ${createOptionalValidateName(item)}
  `;
}
export function createSwaggarDtoDesc(item: FieldDto) {
  if (!item.isRequired) {
    return `@ApiProperty({ description: '${item.nameCh}', required: false })`;
  }
  return `@ApiProperty({ description: '${item.nameCh}' })`;
}

export function CreateDtoHelper(item: FieldDto) {
  if (!item.isAdd) return '';
  return `
  ${createSwaggarDtoDesc(item)}
  ${createLength(item)}
  ${getClassValidateType(item.type)}
  ${createOptional(item.isRequired)}
  ${createValidateType(item.type, item.isTranslate)}
  ${createValidateName(item)} 
  `;
}
