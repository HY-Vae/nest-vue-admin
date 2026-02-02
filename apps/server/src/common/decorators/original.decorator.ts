import { SetMetadata } from '@nestjs/common';
import { ORIGINAL_KEY } from '@/common/constants/decorator.constant';

export const Original = () => {
  return SetMetadata(ORIGINAL_KEY, true);
};
