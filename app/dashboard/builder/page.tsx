import { Breadcrumbs } from '@/components/breadcrumbs';
import { Playground } from '@/components/builder/playground';
import PageContainer from '@/components/layout/page-container';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Builder', link: '/dashboard/builder' }
];

export default function page() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <Playground />
      </div>
    </PageContainer>
  );
}
