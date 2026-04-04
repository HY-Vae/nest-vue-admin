import { SysDictDetailModule } from '@/modules/sys/sys-dict-detial/sys-dict-detail.module';
import { SysDictModule } from '@/modules/sys/sys-dict/sys-dict.module';
import { SysMenuModule } from '@/modules/sys/sys-menu/sys-menu.module';
import { SysRoleModule } from '@/modules/sys/sys-role/sys-role.module';
import { SysUserModule } from '@/modules/sys/sys-user/sys-user.module';
import { Module } from '@nestjs/common';
import { SysActionLogModule } from './sys-action-log/sys-action-log.module';
import { SysDeptModule } from './sys-dept/sys-dept.module';
import { SysPostModule } from './sys-post/sys-post.module';

@Module({
  imports: [
    SysUserModule,
    SysRoleModule,
    SysMenuModule,
    SysDictModule,
    SysDictDetailModule,
    SysDeptModule,
    SysActionLogModule,
    SysPostModule,
  ],
})
export class SysModule {}
