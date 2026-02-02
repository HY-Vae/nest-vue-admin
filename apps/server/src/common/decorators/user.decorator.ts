import { UserKeyEnum } from '@/common/enums/user.enum';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (userKey: UserKeyEnum, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    return userKey ? user[userKey] : user;
  },
);
