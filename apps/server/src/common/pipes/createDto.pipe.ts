import { CurrentUserType } from '@/common/types/auth.type';
import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class CreateDtoPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: any) {}
  transform(value: any, metadata: any) {
    const user: CurrentUserType = this.request.user;
    value.createBy = user.nickName;
    return value;
  }
}
