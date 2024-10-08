import {
  TableColumn,
  defaultColumnFilter
} from '@/components/common/table/column';
import { TableColumnHeader } from '@/components/common/table/header';
import { Role } from '@/types';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { deleteRole } from '@/lib/role';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useToast } from '../ui/use-toast';

export const useRoleTableColumns = (
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Role[], Error>>
): TableColumn<Role>[] => {
  const { toast } = useToast();
  return [
    {
      accessorKey: 'id',
      enableSorting: true,
      enableHiding: true,
      filterFn: defaultColumnFilter,
      header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <span className="w-[60px] truncate font-medium">
            {row.getValue('id')}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'name',
      enableSorting: true,
      enableHiding: true,
      filterFn: defaultColumnFilter,
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('name')}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'description',
      enableSorting: true,
      enableHiding: true,
      filterFn: defaultColumnFilter,
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('description')}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'root',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Root" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">
          {row.getValue('root') ? <Badge>Root</Badge> : null}
        </div>
      ),
      filterFn: (row, id, value) => value === row.getValue(id),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const roleId: number = row.getValue('id');
        const badge = [1, 2, 3].includes(roleId) ? (
          <Badge>System</Badge>
        ) : (
          <Badge variant="secondary">User</Badge>
        );
        return <div className="w-[80px]">{badge}</div>;
      },
      filterFn: (row, id, value) => value === row.getValue(id),
      enableSorting: false,
      enableHiding: true
    },
    {
      accessorKey: 'created_at',
      filterFn: defaultColumnFilter,
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Created at" />
      ),
      cell: ({ row }) => <div>{row.getValue('created_at')}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex h-5 items-center space-x-4 text-sm">
            <Link
              href={`/dashboard/roles/edit?id=${role.id}`}
              className="cursor-pointer hover:underline"
            >
              Edit
            </Link>
            {/* <Separator orientation='vertical' />
          <Link href={`/roles/permissions?id=${role.id}`} className='cursor-pointer hover:underline'>
            Permissions
          </Link> */}
            {![1, 2, 3].includes(role.id) && (
              <>
                <Separator orientation="vertical" />
                <button
                  className="cursor-pointer text-red-800 hover:underline"
                  onClick={async () => {
                    if (
                      confirm(
                        `Are you sure you want to delete this role: ${role.name}?`
                      )
                    ) {
                      try {
                        await deleteRole(role.id);

                        toast({
                          title: 'Success',
                          description: `Role ${role.name} deleted`
                        });
                        await refetch();
                      } catch (e: any) {
                        toast({
                          title: 'Error',
                          description: e.message
                        });
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        );
      }
    }
  ];
};
