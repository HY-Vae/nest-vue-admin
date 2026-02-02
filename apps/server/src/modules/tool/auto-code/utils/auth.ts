import { GenerateConfig } from './generate';
import { CreateSysMenuDto } from '@/modules/sys/sys-menu/dto/req-sys-menu.dto';
import { factory } from 'ts-jest/dist/transformers/hoist-jest';

export function createMenuBody(config: GenerateConfig): CreateSysMenuDto {
  const paths = config.routePath.split('/');
  return {
    menuBtns: [],
    parentId: undefined,
    name: config.name,
    meta: {
      title: config.nameZh,
      icon: '',
      closeTab: true,
      keepAlive: false,
      defaultMenu: false,
    },
    sort: 5,
    hidden: false,
    status: '0',
    path: paths[paths.length - 1] || config.name,
    component: `views/${config.webPath}/${config.camelCase}.vue`,
    auth: `${config.authPrefix}:list`,
    createBy: '自动生成',
  };
}

export function createBtnAuthMap(authPrefix: string, nameZh: string) {
  return [
    {
      name: `新增${nameZh}`,
      auth: `${authPrefix}:create`,
    },
    {
      name: `单个删除${nameZh}`,
      auth: `${authPrefix}:remove`,
    },
    {
      name: `批量删除${nameZh}`,
      auth: `${authPrefix}:removes`,
    },
    {
      name: `编辑${nameZh}`,
      auth: `${authPrefix}:update`,
    },
    {
      name: `查询${nameZh}列表`,
      auth: `${authPrefix}:list`,
    },
    {
      name: `查询${nameZh}详情`,
      auth: `${authPrefix}:detail`,
    },
  ];
}

export function createBtnAuths(authPrefix: string, nameZh: string): string[] {
  return createBtnAuthMap(authPrefix, nameZh).map((item) => item.auth);
}

export function createBtns(
  authPrefix: string,
  nameZh: string,
  parentId: number,
): any[] {
  return createBtnAuthMap(authPrefix, nameZh).map((item, index) => ({
    parentId,
    name: item.name,
    auth: item.auth,
  }));
}
