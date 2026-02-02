import { getDMMF } from '@prisma/internals';
import { readFile } from 'fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import { GenerateConfig, renderTemplate } from './generate';

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

export async function checkModelNmaeExist(modelName: string) {
  const schemaContent = await readFile(schemaPath, 'utf-8');
  // 1. 解析现有 Schema
  const dmmf = await getDMMF({ datamodel: schemaContent });
  return dmmf.datamodel.models.some((model) => model.name === modelName);
}
export async function createPrismaModel(config: GenerateConfig) {
  const modelContent = await renderTemplate('model.hbs', config);
  fs.appendFileSync(schemaPath, modelContent);
}
