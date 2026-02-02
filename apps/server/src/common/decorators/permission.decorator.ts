import { SetMetadata } from '@nestjs/common';
import { PERMISSION_KEY } from '../constants/decorator.constant';

export const Permission = (authKey: string) => {
  return SetMetadata(PERMISSION_KEY, authKey);
};
