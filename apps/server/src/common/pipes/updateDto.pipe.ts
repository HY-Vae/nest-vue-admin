import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CurrentUserType } from '@/common/types/auth.type';

@Injectable()
export class UpdateDtoPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: any) {}
  transform(value: any, metadata: any) {
    const user: CurrentUserType = this.request.user;
    value.updateBy = user.nickName;
    return value;
  }
}
