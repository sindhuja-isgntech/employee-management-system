import React from 'react';
import { Users, UserCheck, UserPlus } from 'lucide-react';

interface MetricsGridProps {
  total: number;
  active: number;
  other: number;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ total, active, other }) => {
  const metrics = [
    {
      title: 'Total Workforce',
      value: total,
      caption: 'Live system count',
      icon: Users,
      iconClass: 'bg-emerald-50 text-emerald-700',
      accent: 'from-emerald-600 to-teal-500',
    },
    {
      title: 'Active Staff',
      value: active,
      caption: 'Currently working',
      icon: UserCheck,
      iconClass: 'bg-emerald-50 text-emerald-600',
      accent: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Onboarding / Leave',
      value: other,
      caption: 'Pending / away',
      icon: UserPlus,
      iconClass: 'bg-amber-50 text-amber-600',
      accent: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Workforce metrics">
      {metrics.map(({ title, value, caption, icon: Icon, iconClass, accent }) => (
        <article
          key={title}
          className="relative overflow-hidden rounded-xl border border-(--border-color) bg-white p-5 shadow-(--shadow-sm) transition-shadow hover:shadow-(--shadow-md)"
        >
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-(--text-muted)">{title}</h4>
              <p className="mt-2 text-3xl font-bold tracking-tight text-(--text-main)">{value}</p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-(--text-light)">{caption}</p>
        </article>
      ))}
    </section>
  );
};

export default MetricsGrid;
