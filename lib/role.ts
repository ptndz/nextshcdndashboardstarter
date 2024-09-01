import { RoleFormValues } from '@/components/role/data';
import { Pagination, Role, User } from '@/types';
import { Delete, Get, Post, Put } from './request';

export const listRoles = async () => {
  return Get<Role[]>('/roles');
};
export const getRole = async (id: string | number | null) => {
  if (!id) {
    return null;
  }

  const role = await Get<Role>(`/roles/${id}`);

  role.permissions;

  return role;
};
export const deleteRole = (id: number) => {
  return Delete(`/roles/${id}`);
};

export const saveRole = async (role: RoleFormValues, id?: number) => {
  if (!id) {
    delete role.$add;
    delete role.$clear;
  }

  let savedRole = null;
  if (!id) {
    savedRole = await Post<Role>('/roles', role);
  } else {
    savedRole = await Put<Role>(`/roles/${id}`, role);
  }

  return savedRole;
};
export const getPermissionList = async () => {
  const resources = await Get<string[]>(`/permissions/list`);
  return resources;
};

export const getUserListByRoleId = async (
  role_id: number,
  limit: number,
  page: number
) => {
  const query: { [k: string]: any } = {};
  limit && (query['limit'] = limit);
  page && (query['page'] = page);
  const queryString = new URLSearchParams(query).toString();

  return await Get<Pagination<User>>(`/users/role/${role_id}?${queryString}`);
};
