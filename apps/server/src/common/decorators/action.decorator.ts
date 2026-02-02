import { ACTION_KEY } from '@/common/constants/decorator.constant';
import { ActionMetaType } from '@/common/types/action.type';
import { SetMetadata } from '@nestjs/common';

export const Action = (option: ActionMetaType) => {
  return SetMetadata(ACTION_KEY, option);
};
