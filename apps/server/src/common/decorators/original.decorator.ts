import { ORIGINAL_KEY } from '@/common/constants/decorator.constant';
import { SetMetadata } from '@nestjs/common';

export const Original = () => {
  return SetMetadata(ORIGINAL_KEY, true);
};
