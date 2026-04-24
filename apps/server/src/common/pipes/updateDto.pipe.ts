import { CurrentUserType } from '@/common/types/auth.type';
import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

interface RequestWithUser {
  user?: CurrentUserType;
}

@Injectable()
export class UpdateDtoPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: RequestWithUser) {}
  transform<T extends { updateBy?: string }>(
    value: T,
    metadata: ArgumentMetadata,
  ): T {
    const user = this.request.user;
    if (user) {
      value.updateBy = user.userName;
    }
    return value;
  }
}
