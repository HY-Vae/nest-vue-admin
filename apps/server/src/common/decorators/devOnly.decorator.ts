import { DEV_ONLY_KEY } from '@/common/constants/decorator.constant';
import { SetMetadata } from '@nestjs/common';

export const DevOnly = () => SetMetadata(DEV_ONLY_KEY, true);
