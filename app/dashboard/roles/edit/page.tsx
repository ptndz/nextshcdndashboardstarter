'use client';

import { useQuery } from '@tanstack/react-query';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { SystemError } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import PageContainer from '@/components/layout/page-container';
import { RoleEditForm } from '@/components/role/edit';
import { getRole } from '@/lib/role';
import { useSearchParams } from 'next/navigation';

export default function RoleEditPage() {
  const query = useSearchParams();
  const roleId = query.get('id');
  const {
    data: editingRole,
    isLoading,
    error
  } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => getRole(roleId),
    retry: false,
    refetchOnWindowFocus: false
  });

  if (isLoading) return <Loading />;
  if (error) return <SystemError error={error} />;

  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: !roleId ? 'New role' : 'Edit role', link: '/dashboard/roles/edit' }
  ];
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <RoleEditForm editingRole={editingRole} />
      </div>
    </PageContainer>
  );
}
