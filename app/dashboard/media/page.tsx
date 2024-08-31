'use client';

import { MediaList } from '@/components/media/list';

import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Media', link: '/dashboard/media' }
];
export default function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <MediaList multiple showUploader />
      </div>
    </PageContainer>
  );
}
