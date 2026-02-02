import { FieldType } from './enum';

export const validateTypeMap = {
  [FieldType.String]: 'string',
  [FieldType.Int]: 'number',
  [FieldType.Float]: 'number',
  [FieldType.Decimal]: 'number',
  [FieldType.Boolean]: 'boolean',
  [FieldType.DateTime]: 'Date',
  [FieldType.Json]: 'string',
  [FieldType.Text]: 'string',
};

export const BASE_STRING_LENGTH = 191;
