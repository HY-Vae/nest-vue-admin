import { GenCodeType } from '@/common/types/config.type';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { dotCase, pascalCase } from 'change-case';
import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import * as process from 'node:process';
import { Node, Project, SyntaxKind } from 'ts-morph';

@Injectable()
export class GenService {
  private readonly logger = new Logger(GenService.name);
  private genConfig: GenCodeType;
  constructor(private readonly configService: ConfigService) {
    this.genConfig = this.configService.get('genCode') as GenCodeType;
  }

  getTempFilePath(temPath: string) {
    const temps = temPath.split('/');
    const basePath = path.resolve(process.cwd(), this.genConfig.serverFolder);
    const files: string[] = [];

    let prefix = '';
    for (let i = 0; i < temps.length; i++) {
      prefix += `/${temps[i]}`;
      // const moduleName = pascalCase(temps[i]);
      files.push(path.join(basePath, prefix, `${temps[i]}.module.ts`));
    }
    return files;
  }

  writeFileSync(filePath: string, content: string) {
    const dir = path.dirname(filePath);
    // 如果文件夹不存在，创建文件夹
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // 写入文件
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  createBaseModuleTemp(name: string) {
    const moduleName = pascalCase(name);
    return `import { Module } from '@nestjs/common';
      @Module({
        imports: [],
      })
    export class ${moduleName}Module {}`;
  }
  async genTempModule(name: string, code: string, temPath: string) {
    const tempFiles = this.getTempFilePath(temPath);
    const preFiles = [
      path.resolve(
        process.cwd(),
        `${this.genConfig.serverFolder}/${this.genConfig.mainModuleName}`,
      ),
      ...tempFiles,
    ];
    const paseTempPath = temPath.split('/');
    const temps = ['app', ...paseTempPath];
    //   1.判断模块是否存在
    if (preFiles.length > 1) {
      for (let i = 0; i < preFiles.length; i++) {
        const file = preFiles[i];
        const isExisted = fs.existsSync(file);
        const pascalName = pascalCase(temps[i]);
        if (!isExisted) {
          //   创建文件 并且写入基础model
          this.writeFileSync(file, this.createBaseModuleTemp(pascalName));
        }
        if (temps[i + 1]) {
          // 根据ast语法，增加引用关系
          const currentModuleName = pascalCase(`${temps[i]}Module`);
          const nextModuleName = pascalCase(`${temps[i + 1]}Module`);
          await this.addImportant(
            file,
            currentModuleName,
            nextModuleName,
            temps[i + 1],
          );
        }
      }
      child_process.exec('npm run format', (err) => {
        if (err) {
          this.logger.error('格式化代码时出错：', err);
        } else {
          this.logger.log('代码格式化成功！');
        }
      });
    }
  }
  async addImportant(
    sourceFilePath: string,
    currentModuleName: string,
    nextModuleName: string,
    nextModulePath: string,
  ) {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(sourceFilePath);
    const moduleClass = sourceFile.getClass(currentModuleName);
    if (!moduleClass) return;
    const decorator = moduleClass.getDecorator('Module');
    if (!decorator) {
      // 创建一个@Module装饰器, 并从 @nestjs/common 中 引入Module
      moduleClass.addDecorator({
        name: 'Module',
        arguments: [`{ imports: [] }`],
      });
      sourceFile.addImportDeclaration({
        namedImports: ['Module'],
        moduleSpecifier: '@nestjs/common',
      });
      const importDecl = sourceFile.getImportDeclaration('@nestjs/common');
      if (!importDecl) {
        sourceFile.addImportDeclaration({
          namedImports: ['Module'],
          moduleSpecifier: '@nestjs/common',
        });
      } else {
        const hasModule = importDecl
          .getNamedImports()
          .some((ni) => ni.getName() === 'Module');
        if (!hasModule) {
          // 不包含 Module，则添加进去
          importDecl.addNamedImport('Module');
        }
      }
    }
    const decoratorArgs = decorator?.getArguments()[0];
    if (!Node.isObjectLiteralExpression(decoratorArgs)) {
      throw new Error('@Module参数需要是对象字面量');
    }
    const importsProp = decoratorArgs.getProperty('imports');
    let importsArray = importsProp?.getChildrenOfKind(
      SyntaxKind.ArrayLiteralExpression,
    )[0];

    // 如果不存在imports属性，则创建
    if (!importsProp) {
      importsArray = decoratorArgs
        .addPropertyAssignment({
          name: 'imports',
          initializer: '[]',
        })
        .getInitializerIfKind(SyntaxKind.ArrayLiteralExpression) as any;
    }
    if (!importsArray) {
      throw new Error('无法创建或定位imports数组');
    }
    const existingModule = importsArray.getElements().some((element) => {
      return element.getText() === nextModuleName;
    });
    if (existingModule) {
      this.logger.log(`模块 ${nextModuleName} 已存在，无需重复添加`);
      return;
    }

    // Step 7：添加新模块到数组
    importsArray.addElement(nextModuleName);
    //   还需要从 对应的模块中导入进来
    sourceFile.addImportDeclaration({
      namedImports: [nextModuleName],
      moduleSpecifier: `./${nextModulePath}/${dotCase(nextModuleName)}`,
    });
    await sourceFile.save();
  }
}
