import { Icons } from '@/components/icons';
import { z } from 'zod';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface Pagination<T> extends PaginationMeta {
  items: T[];
}

export type User = {
  id: string;
  email: string;
  name: string;
  image: string;
  username: string;
  role_id: string;
  updatedAt: Date;
};
export interface Media {
  id: number;
  url: string;
  name: string;
  size: number;
  type: string;
  disk: string;
  checksum: string;
  path: string;
  createAt: string;
  updateAt: string;
}
export interface Content {
  [key: string]: any;
  id?: number;
  createAt?: string | null;
  updateAt?: string | null;
  deletedAt?: string | null;
}
export interface Role extends Content {
  id: number;
  createAt: string;
  updateAt: string;
  deletedAt: string;
  name: string;
  root: boolean;
  permissions?: string[];
  users?: User[];
}
export const relationSingleZodObject = z.string();

export type RelationContentArrayUpdate = {
  $add?: Array<string>;
  $clear?: Array<string>;
};
export interface Permission {
  id: number;
  resource: string;
  value: string;
  role_id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
