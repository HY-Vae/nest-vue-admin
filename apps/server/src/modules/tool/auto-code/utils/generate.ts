import * as path from 'node:path';
import * as fs from 'node:fs';
import * as child_process from 'node:child_process';
import * as Handlebars from 'handlebars';
import { camelCase, pascalCase, snakeCase } from 'change-case';
import { generateField } from './helper/model.helper';
import { CreateDtoHelper, QueryDtoHelper } from './helper/dto.helper';
import { validateTypeMap } from './constant';
import { createQueryHelper } from './helper/service.helper';
import * as ejs from 'ejs';
import * as process from 'node:process';
import { CreateAutoCodeDto, FieldDto } from '../dto/req-auto-code.dto';
import { checkModelNmaeExist } from './model';

import {
  Node,
  ClassDeclaration,
  SourceFile,
  SyntaxKind,
  Project,
} from 'ts-morph';
import { ModuleMetadata } from '@nestjs/common';
import { Temp } from '@prisma/client';
import { getRelativePath } from '@/utils/util';

interface TransNameResult {
  camelCase: string;
  pascalCase: string;
  snakeCase: string;
}

interface GenerateOptions {
  name: string;
  nameZh: string;
  fields: FieldDto[];
  folder?: string;
}

export enum pimaryKeyTypeEnum {
  string = 'string',
  number = 'number',
}

export interface GenerateBaseConfig extends CreateAutoCodeDto {
  serverPath: string;
}

export interface GenerateConfig extends GenerateBaseConfig, TransNameResult {
  pimaryKeyType: pimaryKeyTypeEnum;
  primaryKeyIsNumber: boolean;
  primaryKey: string;
  authPrefix: string;
  serverDir: string;
  genServerFilePaths: string[];
  genWebFilePaths: string[];
  dictKeys: string[];
}

export function transName(name: string): TransNameResult {
  return {
    camelCase: camelCase(name),
    pascalCase: pascalCase(name),
    snakeCase: snakeCase(name),
  };
}

function writeFileSync(filePath: string, content: string) {
  const dir = path.dirname(filePath);
  // 如果文件夹不存在，创建文件夹
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // 写入文件
  fs.writeFileSync(filePath, content, 'utf-8');
}

export function getPrimaryKey(fields: FieldDto[]): string {
  const field = fields.find((item) => item.isPrimary);
  return field ? field.name : '';
}

export function getPrimaryKeyType(fields: FieldDto[]): pimaryKeyTypeEnum {
  const target = fields.find((item) => item.isPrimary);
  if (!target) return pimaryKeyTypeEnum.string;
  return validateTypeMap[target.type] === 'number'
    ? pimaryKeyTypeEnum.number
    : pimaryKeyTypeEnum.string;
}

Handlebars.registerHelper('genField', generateField);
Handlebars.registerHelper('queryDtoHelper', QueryDtoHelper);
Handlebars.registerHelper('createDtoHelper', CreateDtoHelper);
Handlebars.registerHelper('createQueryHelper', createQueryHelper);

export function createFolderUrl(name: string, folder?: string): string {
  if (folder != undefined) {
    return path.posix.join(folder, name);
  }
  return name;
}

export function createAuthPrefix(routePath: string): string {
  const routes = routePath.split('/');
  // 取 routes 的后两个
  return routes.slice(-2).join(':');
}

const createDirIfNotExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export function createWebTempNew(options: GenerateConfig) {
  const tempPath = path.resolve(
    process.cwd(),
    'src/modules/tool/auto-code/templ/web',
  );
  //   1.读取当前路径下面的所有模板
  const files = fs.readdirSync(tempPath);
  files.forEach((file) => {
    const filePath = path.resolve(tempPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      const template = fs.readFileSync(filePath, 'utf-8');
      let fName = path.parse(file).name;
      fName = fName.replace('temp', options.camelCase);
      fName = fName.replace('Temp', options.pascalCase);
      const compiledTemplate = ejs.compile(template);
      const result = compiledTemplate(options);
      const webPath = path.resolve(process.cwd(), '../web/src');
      // 获取生成的两个文件路径
      const viewPath = path.join(webPath, 'views', options.webPath, fName);
      console.log('viewPath', viewPath);
      writeFileSync(viewPath, result);
    }
  });
}

export function createWebTemp(options: GenerateConfig) {
  const tempPath = path.resolve(
    process.cwd(),
    'src/modules/tool/auto-code/templ/web',
  );
  //   1.读取当前路径下面的所有模板
  const files = fs.readdirSync(tempPath);
  files.forEach((file) => {
    const filePath = path.resolve(tempPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      const template = fs.readFileSync(filePath, 'utf-8');
      let fName = path.parse(file).name;
      fName = fName.replace('temp', options.camelCase);
      fName = fName.replace('Temp', options.pascalCase);
      const compiledTemplate = ejs.compile(template);
      const result = compiledTemplate(options);
      const webPath = path.resolve(process.cwd(), '../web/src');
      // 获取生成的两个文件路径
      const viewPath = path.join(webPath, 'views', options.webPath, fName);
      console.log('viewPath', viewPath);
      writeFileSync(viewPath, result);
    }
  });
}

function createServerDir(name: string, serverPath: string) {
  return path.join(process.cwd(), 'src', serverPath, name);
}

function getServerFilePaths(serverDir: string, name: string) {
  const fileTag = ['controller', 'service', 'dto/req-', 'dto/res-', 'module'];
  return fileTag.map((tag) => {
    if (tag === 'dto/req-' || tag === 'dto/res-') {
      return path.resolve(serverDir, `${tag}${name}.dto.ts`);
    }
    return path.resolve(serverDir, `${name}.${tag}.ts`);
  });
}

function getWebFilePaths(webPath: string, name: string): string[] {
  // const fileTag = ['views', 'api'];
  const basePath = path.resolve(process.cwd(), '../web/src');
  // // 创建必要的目录
  // return fileTag.map((tag) => {
  //   return path.resolve(basePath, tag, webPath);
  // });
  return [
    path.resolve(basePath, 'views', webPath, name, 'index.vue'),
    path.resolve(basePath, 'api', webPath, `${name}.js`),
  ];
}

export function transTsTypeByType() {}

/**
 * 将前端传入的参数进行整理
 * @param options
 */
export function createGenerateConfig(
  options: GenerateBaseConfig,
): GenerateConfig {
  options.routePath = getRelativePath(options.routePath);
  options.serverPath = getRelativePath(options.serverPath);
  options.webPath = getRelativePath(options.webPath);
  const pimaryKeyType = getPrimaryKeyType(options.fields);
  const serverDir = createServerDir(options.name, options.serverPath);
  const dictKeys: string[] = [];
  options.fields.forEach((item) => {
    if (item.dictCode) {
      dictKeys.push(item.dictCode);
    }
  });
  options.fields = options.fields.map((item) => {
    item.tsType = validateTypeMap[item.type];
    return item;
  });
  return {
    ...options,
    ...transName(options.name),
    pimaryKeyType,
    primaryKeyIsNumber: pimaryKeyType === pimaryKeyTypeEnum.number,
    authPrefix: createAuthPrefix(options.routePath),
    primaryKey: getPrimaryKey(options.fields),
    serverDir,
    genServerFilePaths: getServerFilePaths(serverDir, options.name),
    genWebFilePaths: getWebFilePaths(options.webPath, options.name),
    dictKeys,
  };
}

export function checkGenFileExit(
  serverFilePaths: string[],
  webFilePaths: string[],
) {
  const filePaths = [...serverFilePaths, ...webFilePaths];
  for (let i = 0; i < filePaths.length; i++) {
    if (fs.existsSync(filePaths[i])) {
      return filePaths[i];
    }
  }
  return null;
}

export async function checkAllRules(config: GenerateConfig) {
  const existPath = checkGenFileExit(
    config.genServerFilePaths,
    config.genWebFilePaths,
  );
  if (existPath) return `${existPath}已存在`;
  const isExist = await checkModelNmaeExist(config.modelName);
  if (isExist) return `${config.modelName} Prisma Model 已存在`;
  return null;
}

export async function generateServerFiles(config: GenerateConfig, temp: Temp) {
  const moduleTemp = await renderTemplate('module.hbs', config);
  const controller = await renderTemplate('controller.hbs', config);
  const service = await renderTemplate('service.hbs', config);
  const req = await renderTemplate('dto/req.hbs', config);
  const res = await renderTemplate('dto/res.hbs', config);
  // 3. 渲染文件
  const files = {
    controller,
    service,
    module: moduleTemp,
    dto: {
      req,
      res,
    },
  };
  // 如果没有文件夹，则进行创建
  createDirIfNotExists(config.serverDir);
  // 4. 写入文件
  Object.entries(files).forEach(([type, content]) => {
    if (typeof content === 'string') {
      const fileName = `${config.name}.${type}.ts`;
      fs.writeFileSync(path.join(config.serverDir, fileName), content);
    } else {
      createDirIfNotExists(path.resolve(config.serverDir, type));
      Object.entries(content).forEach(([dType, dContent]) => {
        const fileName = `${type}/${dType}-${config.camelCase}.${type}.ts`;
        fs.writeFileSync(path.resolve(config.serverDir, fileName), dContent);
      });
    }
  });
  //   5.写入import
  const temps = temp.tempPath.split('/');
  const parentName = temps[temps.length - 1] || '';
  const modulePath = path.resolve(
    'src',
    temp.tempPath,
    `${parentName}.module.ts`,
  );
  addParentImportModule(
    modulePath,
    `./${config.name}/${config.name}.module`,
    `${config.pascalCase}Module`,
    pascalCase(`${parentName}Module`),
  );
}

export default async function generateCRUD(config: GenerateConfig) {
  createWebTemp(config);

  // // 4. 生成目录结构
  // const outputDir = path.join(process.cwd(), 'src', config.camelCase);
  // if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // 5. 写入文件

  console.log('123');
  // 6.追加model 文件
  child_process.exec('npm run db:g', (...arg) => {
    console.log('generate arg', arg);
  });
  child_process.exec('npm run format', (...arg) => {
    console.log('format arg', arg);
  });

  console.log(`✅ ${config.name} 模块生成成功`);
}

export async function renderTemplate(templateName, data) {
  const basePath = path.resolve(process.cwd(), 'src/modules/tool/auto-code');
  const templateContent = fs.readFileSync(
    path.resolve(basePath, 'templ', templateName),
    'utf8',
  );
  return Handlebars.compile(templateContent)(data);
}

/**
 * 添加import语句（添加前会校验是否有重复的module以及变量）
 * @param sourceFile
 * @param moduleSpecifier  目标模块路径，如 './user/user.module'
 * @param importName 需要引入的变量名，如 'UserModule'
 */
export function addImportDeclaration(
  sourceFile: SourceFile,
  moduleSpecifier: string,
  importName: string,
) {
  // 1. 查找是否已有该模块的导入
  const existingImport = sourceFile
    .getImportDeclarations()
    .find((imp) => imp.getModuleSpecifierValue() === importName);

  if (existingImport) {
    // 2. 模块已存在 → 检查是否已引入目标变量
    const hasImportName = existingImport
      .getNamedImports()
      .some((ni) => ni.getName() === importName);

    if (!hasImportName) {
      // 3. 变量未引入 → 添加
      existingImport.addNamedImport(importName);
    }
    return;
  }
  // 4. 模块未引入 → 创建新导入
  sourceFile.addImportDeclaration({
    namedImports: [importName],
    moduleSpecifier: moduleSpecifier,
  });
}

function addModuleToImports(
  sourceFile: SourceFile,
  className: string,
  moduleName: string, // 如 'UserModule'
) {
  const moduleClass = sourceFile.getClass(className);
  // 1. 获取 @Module 装饰器
  const decorator = moduleClass?.getDecorator('Module');
  if (!decorator) {
    addImportDeclaration(sourceFile, 'Module', '@nestjs/common');
    moduleClass?.addDecorator({
      name: 'Module',
      arguments: [`{ imports: [] }`],
    });
  }
  // 2. 获取装饰器参数（对象字面量）
  const decoratorArgs = decorator?.getArguments()[0];
  if (!Node.isObjectLiteralExpression(decoratorArgs)) {
    throw new Error('@Module 参数必须是对象字面量');
  }

  // 3. 获取 imports 属性
  let importsProp = decoratorArgs.getProperty('imports');
  if (!importsProp) {
    // 4. 如果 imports 不存在，则创建空数组
    importsProp = decoratorArgs.addPropertyAssignment({
      name: 'imports',
      initializer: '[]',
    });
  }

  // 5. 获取数组表达式
  const importsArray = importsProp.getChildrenOfKind(
    SyntaxKind.ArrayLiteralExpression,
  )[0];
  if (!importsArray) {
    throw new Error('imports 必须是数组');
  }

  // 6. 检查是否已存在目标模块
  const hasModule = importsArray
    .getElements()
    .some((element) => element.getText() === moduleName);
  if (hasModule) {
    console.log(`模块 ${moduleName} 已存在`);
    return;
  }

  // 7. 添加新模块到数组
  importsArray.addElement(moduleName);
}

export function addParentImportModule(
  sourceFilePath: string,
  moduleSpecifier: string,
  importName: string,
  className: string,
) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(sourceFilePath);
  addImportDeclaration(sourceFile, moduleSpecifier, importName);
  addModuleToImports(sourceFile, className, importName);
  sourceFile.save();
}
