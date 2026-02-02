import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '@/common/constants/decorator.constant';

export const Public = () => {
  return SetMetadata(PUBLIC_KEY, true);
};
