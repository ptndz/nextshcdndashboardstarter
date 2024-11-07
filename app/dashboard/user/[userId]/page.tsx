'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SystemError } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { ProfileForm } from '@/components/forms/profile-form';
import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';
import { getUser } from '@/lib/user';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const isNewUser = userId === 'new';

  const {
    data: editingUser,
    isLoading,
    error
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => (isNewUser ? null : getUser(userId)),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !isNewUser
  });

  if (isLoading) return <Loading />;
  if (error) return <SystemError error={error} />;
  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'User', link: '/dashboard/user' },
    {
      title: isNewUser ? 'Create' : 'Edit',
      link: isNewUser ? '/dashboard/user/new' : `/dashboard/user/${userId}`
    }
  ];
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div>
          <h3 className="text-lg font-medium">User</h3>
          <p className="text-sm text-muted-foreground">
            {!isNewUser ? 'Update your user settings.' : 'Create a new user.'}
          </p>
        </div>
        <Separator />
        <ProfileForm isNewUser={isNewUser} user={editingUser} />
      </div>
    </PageContainer>
  );
}
