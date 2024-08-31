import { User } from '@/types';
import { Get } from './request';

export const getUserInfo = (disableErrorNotification?: boolean) => {
  return Get<User>('/auth/me', { disableErrorNotification });
};
