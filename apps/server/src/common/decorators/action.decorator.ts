import { SetMetadata } from '@nestjs/common';
import { ACTION_KEY } from '@/common/constants/decorator.constant';
import { ActionMetaType } from '@/common/types/action.type';

export const Action = (option: ActionMetaType) => {
  return SetMetadata(ACTION_KEY, option);
};
