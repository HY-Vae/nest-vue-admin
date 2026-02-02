import { Module } from '@nestjs/common';
import { SysUserModule } from '@/modules/sys/sys-user/sys-user.module';
import { SysRoleModule } from '@/modules/sys/sys-role/sys-role.module';
import { SysMenuModule } from '@/modules/sys/sys-menu/sys-menu.module';
import { SysDictModule } from '@/modules/sys/sys-dict/sys-dict.module';
import { SysDictDetailModule } from '@/modules/sys/sys-dict-detial/sys-dict-detail.module';
import { SysDeptModule } from './sys-dept/sys-dept.module';
import { SysActionLogModule } from './sys-action-log/sys-action-log.module';

@Module({
  imports: [
    SysUserModule,
    SysRoleModule,
    SysMenuModule,
    SysDictModule,
    SysDictDetailModule,
    SysDeptModule,
    SysActionLogModule,
  ],
})
export class SysModule {}
