import { Pagination, PaginationMeta } from '@/types';
import {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { TableColumn } from './column';

export interface TableProps<T> {
  data?: T[];
  columns: TableColumn<T>[];
  filterTitle?: string;
  enableRowSelection?: boolean;
  ssr?: boolean;
  pagination?: PaginationMeta;
  getRowId?: (
    originalRow: T,
    index: number,
    parent?: Row<T> | undefined
  ) => string;
  request?: RequestFn<T>;
  onRowSelectionChange?: (ids: Array<string | number>) => void;
}

export interface GetTableOptionsProps<T> {
  pageCount?: number;
  columns: TableColumn<T>[];
  enableRowSelection?: boolean;
  ssr?: boolean;
  getRowId?: (
    originalRow: T,
    index: number,
    parent?: Row<T> | undefined
  ) => string;
  onPaginationChange?: OnChangeFn<PaginationState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onSortingChange?: OnChangeFn<SortingState>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
}

export type RequestFn<T> = (state: {
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
}) => Promise<Pagination<T> | undefined | void>;

export interface SendRequestProps<T> {
  sorting: SortingState;
  pagination: PaginationState;
  columnFilters: ColumnFiltersState;
  initialized: MutableRefObject<boolean>;
  ssr?: boolean;
  resetPage?: boolean;
  request?: RequestFn<T>;
  setData?: Dispatch<SetStateAction<T[]>>;
  setLoading?: Dispatch<SetStateAction<boolean>>;
  setPaginationData: Dispatch<SetStateAction<PaginationMeta | undefined>>;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}
