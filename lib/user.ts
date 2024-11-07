import { ProfileFormValues } from '@/components/forms/profile-form';
import { Pagination, User } from '@/types';
import { Get, Post, Put } from './request';

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

export const getUser = (userId: string | number | null) => {
  if (!userId) {
    return null;
  }
  return Get<User>(`/users/${userId}`);
};
export const saveUser = async (user: ProfileFormValues, id?: string) => {
  let savedUser = null;
  if (!id) {
    savedUser = await Post<User>('/users', user);
  } else {
    savedUser = await Put<User>(`/users/${id}`, user);
  }

  return savedUser;
};
