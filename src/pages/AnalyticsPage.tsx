import React from 'react';
import { BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';

export const AnalyticsPage: React.FC = () => (
  <div>
    <PageHeader title="Analytics & Reports" subtitle="Detailed performance analytics and metrics." />

    <div className="flex flex-col items-center rounded-2xl border border-dashed border-(--border-color) bg-white px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-soft) text-(--primary)">
        <BarChart3 className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-(--text-main)">Reports are on the way</h3>
      <p className="mt-1 max-w-sm text-sm text-(--text-muted)">
        Workforce trends, department breakdowns and performance insights will appear here.
      </p>
    </div>
  </div>
);

export default AnalyticsPage;
