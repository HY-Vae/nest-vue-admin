import { CurrentUserType } from '@/common/types/auth.type';
import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class UpdateDtoPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: any) {}
  transform(value: any, metadata: any) {
    const user: CurrentUserType = this.request.user;
    value.updateBy = user.nickName;
    return value;
  }
}
