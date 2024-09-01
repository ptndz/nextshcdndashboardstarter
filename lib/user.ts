import { Pagination, User } from '@/types';
import { Get } from './request';

export const getUserInfo = (disableErrorNotification?: boolean) => {
  return Get<User>('/auth/me', { disableErrorNotification });
};
export const getUsersList = (limit: number, page: number) => {
  const query: { [k: string]: any } = {};
  limit && (query['limit'] = limit);
  page && (query['page'] = page);
  const queryString = new URLSearchParams(query).toString();
  return Get<Pagination<User>>(`/users?${queryString}`);
};
