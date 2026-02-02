import { PUBLIC_KEY } from '@/common/constants/decorator.constant';
import { SetMetadata } from '@nestjs/common';

export const Public = () => {
  return SetMetadata(PUBLIC_KEY, true);
};
