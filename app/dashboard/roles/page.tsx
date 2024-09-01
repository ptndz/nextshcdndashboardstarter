'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/common/button';
import { SystemError } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { Table } from '@/components/common/table';
import PageContainer from '@/components/layout/page-container';
import { useRoleTableColumns } from '@/components/role/role';
import { listRoles } from '@/lib/role';
import { Role } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
export default function RolesList() {
  const {
    data: roles,
    isLoading,
    error,
    refetch
  } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: listRoles
  });

  const roleTableColumns = useRoleTableColumns(refetch);

  if (isLoading) return <Loading />;
  if (error) return <SystemError error={error} />;

  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Roles list', link: '/dashboard/roles' }
  ];
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex w-full items-center justify-between space-y-2">
          <div className="ml-auto mr-4 flex gap-2">
            <Link key="create" href="/dashboard/roles/edit">
              <Button size="sm" icon={<PlusCircle className="mr-2 h-4 w-4" />}>
                New Role
              </Button>
            </Link>
          </div>
        </div>
        <Table<Role>
          data={roles}
          columns={roleTableColumns}
          getRowId={(row) => row.name}
          filterTitle="Filter roles"
        />
      </div>
    </PageContainer>
  );
}
