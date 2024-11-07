'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { SystemError } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import PageContainer from '@/components/layout/page-container';
import { UserClient } from '@/components/tables/user-tables/client';
import { listRoles } from '@/lib/role';
import { getUsersList } from '@/lib/user';
import { useQuery } from '@tanstack/react-query';

export default function Page() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', 'roles'],
    queryFn: async () => {
      const [usersData, rolesData] = await Promise.all([
        getUsersList(20, 1),
        listRoles()
      ]);
      return { users: usersData, roles: rolesData };
    }
  });
  if (isLoading) return <Loading />;
  if (error) return <SystemError error={error} />;
  const users = data?.users.items ?? [];
  const roles = data?.roles ?? [];

  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'User', link: '/dashboard/user' }
  ];
  return (
    <PageContainer>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <UserClient data={users} roles={roles} />
      </div>
    </PageContainer>
  );
}
